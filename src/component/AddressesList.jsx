import {useEffect, useState} from "react";
import "./AddressesList.css"
import Address from "./Address";
import FormAddress from "./FormAddress";

export default function AddressesList(props) {
    const ADDRESSES_URL = "https://6405ae1ceed195a99f89363f.mockapi.io/api/addresses"

    let [addresses, setAddresses] = useState([])
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState(undefined)
    let [selectedItem, setSelectedItem] = useState(null)
    let [refresh, setRefresh] = useState(0)

    useEffect(() => {
        const abortController = new AbortController();

        const getAddresses = async () =>  {
            setLoading(true);
            await fetch(ADDRESSES_URL, { signal: abortController.signal })
                .then(response => {
                    setLoading(false);
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error("Failed to load Addresses")
                })
                .then(data => setAddresses(data))
                .catch(err => {
                    if (err.name !== "AbortError") {
                        console.error(err.message);
                        setError(err.message)
                    }
                })
            // setRefresh(refresh+1);
        };

        getAddresses();

        return () => {
            abortController.abort();
        };
    }, [refresh])

    const addressUpdate = (updatedAddressId) => setSelectedItem(addresses.find(address => address.id === updatedAddressId));

    const deleteAddress = (deletedAddressId) => {
        const deletedAddressURL = ADDRESSES_URL + "/" + deletedAddressId;
        fetch(deletedAddressURL, {
            method: 'Delete'
            })
            .then(response => {
                if (response.ok) {
                    setRefresh(refresh+1);
                    return;
                }
                throw new Error("Failed to delete address")
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
                        setRefresh(refresh + 1);
                        return;
                    }
                    throw new Error("Failed to added address")
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
                    setRefresh(refresh+1);
                    return;
                }
                throw new Error("Failed to update address")
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