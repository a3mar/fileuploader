import React from 'react'
import '../App.css'
import logo from '../AMO.png'

export default class ResultScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container g-form">
                <div className="header formrow">
                <a href='https://amo.md'><img class="logo" src={logo} alt="Logo" ></img></a>
                    <h2>Пересылка завершена:</h2>
                    <p><span className="bold">Общий объем: </span> { this.props.full_size } MB</p>
                    <p><span className="bold">Средняя скорость: </span>{ this.props.avg_speed } Mb/s</p>
                </div><hr /><div className="formrow">
                    <h2> Ваши данные:</h2>
                    <p><span className="bold">Имя: </span>{ this.props.first_name }</p>
                    <p><span className="bold">Фамилия: </span>{ this.props.last_name }</p>
                    <p><span className="bold">Примечания (например, что исследовали): </span>{ this.props.comment }</p>
                    <p><span className="bold">Кто загружает данные: </span>{ this.props.role }</p>
                </div><hr /><div className="formrow">
                    <h2>Файлы:</h2>
                    {this.props.files.map((file) => {
                        return (<p>
                            <span className="bold">{file.name}</span> : {file.size}MB успешно загружено
                            </p>)
                    })}
                </div> 
                    <div class="return" onClick={this.props.resetFn}>Вернуться к загрузке данных</div>
            </div >
        )
    }
}