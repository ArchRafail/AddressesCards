import {useEffect, useState} from "react";
import "./FormAddress.css"
import {Types} from "../constants/Types.ts";


export default function FormAddress(props) {
    let [id, setId] = useState(props.id || undefined)
    let [country, setCountry] = useState(props.country);
    let [city, setCity] = useState(props.city);
    let [street, setStreet] = useState(props.street);
    let [type, setType] = useState(props.type || Types.OFFICE);

    useEffect(() => {
        setId(props.id || undefined);
        setCountry(props.country);
        setCity(props.city);
        setStreet(props.street);
        setType(props.type || Types.OFFICE);
    }, [props.country, props.city, props.street, props.type])

    const handleClear = (event) => {
        event.preventDefault();
        clearForm();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let newAddress = {
            country,
            city,
            street,
            type
        };
        if (id) {
            newAddress["id"] = id
        }
        try {
            blankAudit(newAddress.country, newAddress.city, newAddress.street)
        } catch (err) {
            console.error(err.message);
            return
        }
        clearForm();
        props.onChangeAddress && props.onChangeAddress(newAddress)
    }

    const clearForm = () => {
        setId(undefined);
        setCountry("");
        setCity("");
        setStreet("");
        setType(Types.OFFICE);
    }

    const blankAudit = (newCountry, newCity, newStreet) => {
        if (!newCountry || newCountry.trim().length === 0) {
            throw new Error("Country field can't be empty!");
        }
        if (!newCity || newCity.trim().length === 0) {
            throw new Error("City field can't be empty!");
        }
        if (!newStreet || newStreet.trim().length === 0) {
            throw new Error("Street field can't be empty!");
        }
        return true
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label className="addressDesc" htmlFor="addressId">Id: </label>
                <label id="addressId">{id || ""}</label>
            </div>
            <div>
                <label className="addressDesc" htmlFor="country">Country:</label>
                <input type="text" id="country" value={country || ""} onChange={event => setCountry(event.target.value)}/>
            </div>
            <div>
                <label className="addressDesc" htmlFor="city">City:</label>
                <input type="text" id="city" value={city || ""} onChange={event => setCity(event.target.value)}/>
            </div>
            <div>
                <label className="addressDesc" htmlFor="street">Street:</label>
                <input type="text" id="street" value={street || ""} onChange={event => setStreet(event.target.value)}/>
            </div>
            <div>
                <label className="addressDesc">Type:</label>
                <div className="radioButtons">
                    <div className="radioButton">
                        <input type="radio" id="HOME" name="type" value="HOME" onChange={event => setType(event.target.value)} checked={type===Types.HOME}/>
                        <label htmlFor="HOME">Home</label>
                    </div>
                    <div className="radioButton">
                        <input type="radio" id="OFFICE" name="type" value="OFFICE" onChange={event => setType(event.target.value)} checked={type===Types.OFFICE}/>
                        <label htmlFor="OFFICE">Office</label>
                    </div>
                </div>
            </div>
            <div className="formButtons">
                <button id="clear" type="clear" onClick={handleClear}>Clear</button>
                <button id="submit" type="submit">{id ? "Change" : "Add"}</button>
            </div>
        </form>
    )
}