import {useState} from "react";
import "./Address.css"
import {Types} from "../constants/Types.ts";


export default function Address(props) {
    let [id] = useState(props.id)
    let [country] = useState(props.country);
    let [city] = useState(props.city);
    let [street] = useState(props.street);
    let [type] = useState(props.type);

    const editAddress = () => {
        props.onAddressUpdate && props.onAddressUpdate(id)
    }

    const deleteAddress = () => {
        props.onDeleteAddress && props.onDeleteAddress(id)
    }

    return (
        <div className="wrapper">
            <div className="card">
                <div className="image">{type===Types.HOME ? <img className="addressIcon" src="https://cdn.iconscout.com/icon/premium/png-256-thumb/home-1757580-1495274.png" alt="Home"/> :
                    <img className="addressIcon" src="https://cdn.iconscout.com/icon/premium/png-256-thumb/company-2687916-2229475.png" alt="Office"/>}</div>
                <div className="description">
                    <div className="text">{id}</div>
                    <div className="text">{country}</div>
                    <div className="text">{city}</div>
                    <div className="text">{street}</div>
                </div>
                <div title="Edit" className="editButton" onClick={editAddress}>
                    <img className="cardIcon" src="https://cdn.iconscout.com/icon/free/png-256/pencil-drawing-sketch-stationary-38120.png" alt="edit"/>
                </div>
                <div title="Delete" className="deleteButton" onClick={deleteAddress}>
                    <img className="cardIcon" src="https://cdn.iconscout.com/icon/free/png-256/trash-bin-3905690-3288030.png" alt="delete"/>
                </div>
            </div>
        </div>
    )
}