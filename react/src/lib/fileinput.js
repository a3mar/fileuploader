import React from 'react'
import '../App.css'

export default class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {"hasError": false, "filled": false}
    }

    onFileSelect = (e) => {
      let filename = e.target.value.split(/(\\|\/)/g).pop()
      let fileext = filename.split('.')[filename.split('.').length - 1]
      let regex = /^(zip|pdf|jpg|jpeg|tiff|tif|png|doc|docx|rtf|txt|xml|xmlx|ods|odf|xls|xlsx)$/i

      if (!fileext.match(regex)) {
        this.setState({"hasError": true})
        console.log(`${fileext} NOT matches`)  
      } else {
        this.setState({"hasError": false, "filled": true}) 
      }
    }

    filled = () => this.state.filled

    render() {
        let index = this.props.index
        let type = this.props.type
        let disabled = this.props.disabled()
        let hasError = this.state.hasError
        let rowClasses = hasError ? "rightaligned formrow witherror" : "rightaligned formrow"
        return (
            <div className={ rowClasses } >
                <label> Файл {index + 1} :
                    <input
                        className="fullwidth file-input"
                        type="file"
                        name={`uploaded_file_${index}`}
                        onChange={this.onFileSelect}
                        disabled={disabled}
                    />
                </label>
                <span className="sidebutton" onClick={this.props.addInput} itemID={index}> {type === "add" ? "+" : "-" } </span>
                { hasError &&
                <div className="err_desc">
                  Загружаемые файлы должны быть в одном из форматов:<br /> 
                  zip, pdf, jpg, jpeg, tiff, tif, png, doc, docx, rtf, txt, xml, xmlx, xls, xlsx ods, odf
                </div> 
                }
            </div>
        )
    }

}