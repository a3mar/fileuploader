import React from 'react'
import '../App.css'

export default class ResultScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="g-form">
                <div className="header formrow">
                    <h1>Obuhoff KG</h1>
                    <h2>Пересылка завершена:</h2>
                    <p><span className="bold">Длительность пересылки: </span> { this.props.resp_time } seconds</p>
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
                </div> <hr /> <div className="formrow">
                    <h2>Система сообщила администратору о загруженных Вами данных.</h2>
                    <div onClick={this.props.resetFn}>Вернуться к загрузке данных</div>
                </div>
            </div >
        )
    }
}