import React from 'react';
import FileUploadProgress from 'react-fileupload-progress';
import MyForm from './lib/form'
import ResultScreen from './lib/result'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = { 
      "finished": false, 
      "results": {
        "files": [
          {"name": "test1", "size": "234KB"}
        ]
      }
    }
  }

  submitButton = (progress, hasError, cancelHandler) => {
    let initState = progress === -1
    let classes = hasError ? "input-submit error" : "input-submit"
    let width = initState ? 100 : progress
    let message = initState ? "Отправить файлы" : `${progress}% загружено`

    return (
      <div className="submit-wrapper">
        <div className="progressbar" style={{ width: width + "%" }}></div>
        <input
          className={classes}
          type="submit"
          form="myForm"
          value={hasError ? "Ошибка загрузки" : message}
        />

      </div>
    )
  }

  finish = (request) => {
    let result = JSON.parse(request.response)
    result.resetFn = this.reset

    this.setState({
      "finished": true,
      "result": result
    })
  }

  reset = () => {
    this.setState({
      "finished": false,
      "result": {}
    })
  }

  form = () => {
    return (
      <div className="container">
        <FileUploadProgress key='ex1' method="POST" url='/upload'
          formRenderer={this.formRenderer}
          formGetter={this.formGetter}
          progressRenderer={this.submitButton}
          onProgress={(e, request, progress) => { console.log('progress', e, request, progress); }}
          onLoad={(e, request) => { this.finish(request) }}
          onError={(e, request) => { console.log('error', e, request); }}
          onAbort={(e, request) => { console.log('abort', e, request); }}
        />
      </div>
    )
  }
  formRenderer = (submit) => <MyForm submitFn={submit} divId="myForm" />
  formGetter = () => { return (new FormData(document.getElementById('myForm'))) }

  result = (resp) => {
    let result = this.state.result
    return (
      <div className="container">
        <ResultScreen { ...result} />
      </div>
    )
  }

  render() {
    if (this.state.finished) {
      return (this.result(1))
    } else {
      return (this.form())
    }
  }

}
