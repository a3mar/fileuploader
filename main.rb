require "sinatra"
require "fileutils"
require "mail"
require "russian"
require "digest"

require "./config/options.rb"

class FileUploader < Sinatra::Base
  Mail.defaults do
    delivery_method :smtp, Options[:mail]
  end

  before do
    headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    headers["Access-Control-Allow-Headers"] = "accept, authorization, origin"
  end

  options "*" do
    response.headers["Allow"] = "HEAD,GET,PUT,DELETE,OPTIONS,POST"
    response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
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
    # require "pry"
    # binding.pry
    first_name = Russian.translit params["first_name"]
    last_name = Russian.translit params["last_name"]
    role = params["role"]
    comment = params["comment"]
    file_path = "upload/#{first_name}_#{last_name}/"
    file_list = Array.new

    FileUtils.mkdir_p file_path

    params.keys.select { |key| key =~ /^uploaded_file/ }.each do |file|
      filename = params[file][:filename]
      tmpfile = params[file][:tempfile]
      fullpath = "#{file_path}#{filename}"

      FileUtils.cp_r tmpfile.path, fullpath
      FileUtils.chmod 0644, fullpath
      file_list << generate_secure_link(fullpath)
    end

    mailbody = erb(
      :mailtemplate,
      locals: {
        name: "#{role} #{first_name} #{last_name}",
        comment: comment,
        file_list: file_list,
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

    mailbody
  end
end
