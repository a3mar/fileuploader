import React from 'react'
import '../App.css'

export default class FileInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let index = this.props.index
        let type = this.props.type
        return (
            <div className="rightaligned formrow" >
                <label> Файл {index + 1} :
                    <input
                        className="fullwidth file-input"
                        type="file"
                        name={`uploaded_file_${index}`}
                    />
                </label>
                <span className="sidebutton" onClick={this.props.addInput} itemID={index}> {type === "add" ? "+" : "-" } </span>
            </div>
        )
    }

}