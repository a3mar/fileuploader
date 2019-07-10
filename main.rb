require "sinatra"
require "fileutils"
require "mail"
require "russian"
require "digest"
require "humanize-bytes"

require "./config/options.rb"

class FileUploader < Sinatra::Base
  Mail.defaults do
    delivery_method :smtp, Options[:mail]
  end

  def generate_secure_link(uri)
    secret = Options[:common][:secure_link_secret]
    seclink_str = "#{uri}#{secret}"
    digest = Digest::MD5.hexdigest seclink_str
    "#{Options[:common][:secure_link_location]}/#{digest}/#{uri}"
  end

  get "/" do
    send_file File.expand_path("index.html", "#{settings.public_folder}")
  end

  post "/upload" do
    start_time = Time.now
    first_name = Russian.translit params["first_name"]
    last_name = Russian.translit params["last_name"]
    role = params["role"]
    comment = params["comment"]
    file_path = "upload/#{first_name}_#{last_name}/"
    file_list = Array.new
    secure_links = Array.new

    FileUtils.mkdir_p file_path

    params.keys.select { |key| key =~ /^uploaded_file/ }.each do |file|
      filename = params[file][:filename]
      tmpfile = params[file][:tempfile]
      fullpath = "#{file_path}#{filename}"
      size_bytes = File.size tmpfile
      size_mb = Humanize::Byte.new(size_bytes).to_m

      FileUtils.cp_r tmpfile.path, fullpath
      FileUtils.chmod 0644, fullpath
      file_list << { name: filename, size: size_mb.value.round(1) }
      secure_links << generate_secure_link(fullpath)
    end

    resp_time = Time.now - start_time
    # require "pry"
    # binding.pry
    full_size = file_list.reduce(0) { |memo, e| memo += e[:size] }
    avg_speed = full_size / 8 / resp_time

    mailbody = erb(
      :mailtemplate,
      locals: {
        name: "#{role} #{first_name} #{last_name}",
        comment: comment,
        file_list: secure_links,
      },
    )

    mail = Mail.deliver do
      from Options[:common][:mail_from]
      to Options[:common][:mail_to]
      subject "New files from #{role} #{first_name} #{last_name}"
      html_part do
        content_type "text/html; charset=UTF-8"
        body mailbody
      end
    end

    content_type :json
    {
      first_name: first_name,
      last_name: last_name,
      role: role,
      comment: comment,
      files: file_list,
      full_size: full_size.round(1),
      avg_speed: avg_speed.round(1),
      resp_time: resp_time.round(1),
    }.to_json
  end
end
