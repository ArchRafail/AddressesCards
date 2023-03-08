import {useEffect, useState} from "react";
import "./AddressesList.css"
import Address from "./Address";
import FormAddress from "./FormAddress";


export default function AddressesList() {
    const ADDRESSES_URL = "https://6405ae1ceed195a99f89363f.mockapi.io/api/addresses"

    let [addresses, setAddresses] = useState([])
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState(undefined)
    let [selectedItem, setSelectedItem] = useState(null)

    useEffect(() => {
        const abortController = new AbortController();
        getAddresses();
        return () => {
            abortController.abort();
        };
    }, [])

    const getAddresses = async () =>  {
        setLoading(true);
        await fetch(ADDRESSES_URL)
            .then(response => {
                setLoading(false);
                if (response.ok) {
                    return response.json()
                }
                throw new Error("Failed to load addresses")
            })
            .then(data => setAddresses(data))
            .catch(err => {
                console.error(err.message);
                setError(err.message)
            })
    };

    const addressUpdate = (updatedAddressId) => setSelectedItem(addresses.find(address => address.id === updatedAddressId));

    const deleteAddress = (deletedAddressId) => {
        const deletedAddressURL = ADDRESSES_URL + "/" + deletedAddressId;
        fetch(deletedAddressURL, {
            method: 'Delete'
            })
            .then(response => {
                if (response.ok) {
                    getAddresses();
                    return;
                }
                throw new Error("Failed to delete an address")
            })
            .catch(err => {
                console.error(err.message);
                setError(err.message)
            })
    }

    const changeAddress = (changedAddress) => {
        console.log(changedAddress)
        if (changedAddress.id) {
            const changedAddressURL = ADDRESSES_URL + "/" + changedAddress.id;
            fetch(changedAddressURL, {
                method: 'PUT',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(changedAddress)
            })
                .then(response => {
                    if (response.ok) {
                        setAddresses([])
                        setSelectedItem(null);
                        getAddresses();
                        return;
                    }
                    throw new Error("Failed to update an address")
                })
                .catch(err => {
                    console.error(err.message);
                    setError(err.message)
                })
        } else {
            fetch(ADDRESSES_URL, {
                method: 'POST',
                headers: {'content-type':'application/json'},
                body: JSON.stringify(changedAddress)
            })
            .then(response => {
                if (response.ok) {
                    getAddresses();
                    return;
                }
                throw new Error("Failed to add an address")
            })
            .catch(err => {
                console.error(err.message);
                setError(err.message)
            })
        }
    }

    return (
        <div className="AddressesList">
            <h1>Addresses: </h1>
            { loading &&
                <div className="loaderСontainer">
                    <div className="innerСontainer">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <p>Loading addresses...</p>
                    </div>
                </div>
            }

            { !loading && error && <div className="error">{error}</div>}
            { !loading && !error && !addresses.length && <div className="no-data">Addresses not found</div>}

            {
                !loading && !error && addresses.length &&
                <div className="addresses">
                    {addresses.map(address =>
                        <Address key={address.id} id={address.id} country={address.country} city={address.city}
                                 street={address.street} type={address.type} onAddressUpdate={addressUpdate} onDeleteAddress={deleteAddress}/>
                    )}
                </div>
            }

            {
                selectedItem ? <FormAddress id={selectedItem.id} country={selectedItem.country} city={selectedItem.city}
                                         street={selectedItem.street} type={selectedItem.type}
                                         onChangeAddress={changeAddress}/> : <FormAddress onChangeAddress={changeAddress}/>
            }

        </div>
    )
}