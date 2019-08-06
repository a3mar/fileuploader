import React from 'react'
import FileInput from './fileinput'
import '../App.css'
import logo from '../AMO.png'

export default class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { "inputs": [], "disabled": false }
  }

  componentWillMount = () => {
    this.addInput()
  }

  addInput = () => {
    if (this.state.inputs.length >= 10 ) { return(null) }
    let current = this.state.inputs
      .filter((v) => {return(v !== null)})
      .map((val,index) => {
        return(
          val === null ? null : <FileInput key={index} index={index} type="rm" addInput={this.rmInput} />
        )
    })

    current.push(
      <FileInput key={current.length} index={current.length} type="add" addInput={this.addInput} />
    )

    this.setState({inputs: current})
  }

  rmInput = (event) => {
    let id = event.currentTarget.getAttribute('itemid')
    let current = this.state.inputs
    current[id] = null
    this.setState({inputs:current})
  }

  render() {
    const submitFn = this.props.submitFn;
    const divId = this.props.divId;
    return (
      <form id={divId} className="g-form" onSubmit={submitFn}>
        <div className="header formrow">
          <a href='https://amo.md'><img class="logo" src={logo} alt="Logo" ></img></a>
          <p>Защищенная система отправления файлов - amo.md</p>
          <p>
            Можно пересылать не более 10 файлов.
            Можно захватывать несколько файлов одновременно
            при большом количестве файлов следует упаковать их в архив (*.zip)
          </p>
          <p>
            При загрузке радиологических дисков, таких как МРТ/КТ/ангиогр. и т.п.,
            составьте архив (*.zip) всего диска, а не только избранных файлов или папок. Имя и фамилию лучше указывать латинскими буквами.
          </p>
        </div>
        <hr />

        <div className="rightaligned formrow">
          <label> Имя:
            <input className="fullwidth" type="text" name="first_name" placeholder="First name" required />
          </label>
        </div>

        <div className="rightaligned formrow">
          <label> Фамилия:
             <input className="fullwidth" type="text" name="last_name" placeholder="Last name" required />
          </label>
        </div>

        <div className="rightaligned formrow">
          <label> Кем загружено:
            <div className="radioGroup">
              <label className="role" > Пациент
              <input type="radio" name="role" value="patient" />
              </label>
              <label className="role" > Сотрудник
              <input type="radio" name="role" value="employee" />
              </label>
            </div>
          </label>

        </div>
        <div className="rightaligned formrow">
          <textarea className="textarea-comment" name="comment" placeholder="Примечания к загруженным файлам (вид/зона/дата исследования и т.п.)"></textarea>
        </div>
        <hr />

        { this.state.inputs.filter((e) => e !== null) }

      </form>
    )
  }
};
