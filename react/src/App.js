import React from 'react';
import FileUploadProgress from 'react-fileupload-progress';
import MyForm from './lib/form'

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  submitButton = (progress, hasError, cancelHandler) => {
    console.log(progress, hasError)
    let initState = progress === -1 
    let classes = hasError ? "input-submit error" : "input-submit"
    let width = initState ? 100 : progress
    let message = initState ? "Отправить файлы" : `${progress}% загружено`

    return(
      <div className="submit-wrapper">
      <div className="progressbar" style={{ width: width + "%" }}></div>
      <input 
          className={ classes }
          type="submit"  
          form="myForm"
          value={hasError ? "Ошибка загрузки" : message}
        />
        
        </div>
    )
  }

  formRenderer = (submit) => <MyForm submitFn={submit} divId="myForm" />
  formGetter = () => { return(new FormData(document.getElementById('myForm'))) }

  render() {
    return (
      <div className="container">
        <FileUploadProgress key='ex1' method="POST" url='/upload'
          formRenderer={ this.formRenderer }
          formGetter={this.formGetter}
          progressRenderer={ this.submitButton }
          onProgress={(e, request, progress) => { console.log('progress', e, request, progress); }}
          onLoad={(e, request) => { console.log('load', e, request); }}
          onError={(e, request) => { console.log('error', e, request); }}
          onAbort={(e, request) => { console.log('abort', e, request); }}
        />
      </div>
    )
  }
}
