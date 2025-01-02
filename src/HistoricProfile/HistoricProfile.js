import "./HistoricProfile.css"
import ProfilePic from "../ProfilePic/ProfilePic"

const HistoricProfile = () => {
    return (
        <div className="historicProfile">
            <ProfilePic/>
            <div className="titles">
                <h2>Juliana Louis</h2>
                <p><span>Histórico de releitura</span> há 45 minutos</p>
            </div>
            <div className="likes">
                <i className="material-icons">favorite_border</i>
                <p>13</p>
            </div>
            <div className="comments">
                <i className="material-icons">notes</i>
                <p>2</p>
            </div>
        </div>
    )
}

export default HistoricProfile