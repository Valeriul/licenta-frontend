import React, { useState, useRef, useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Knob } from 'primereact/knob';
import { Button } from 'primereact/button';
import { useUser } from '../../contexts/UserContext';
import CardHeader from "../CardHeader/CardHeader";

function Relay({ initialState, initialName, initialLocation, battery, uuid }) {
    const [state, setState] = useState(initialState);
    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialLocation);
    const [batteryLevel, setBatteryLevel] = useState(battery);

    const { getUserId } = useUser();
    const userID = getUserId();

    const bufferRef = useRef([]);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setBrightness(initialBrightness);
        setName(initialName);
        setLocation(initialLocation);
        setBatteryLevel(battery);
    }, [initialBrightness, initialName, initialLocation, battery]);


    const setOn = (value) => {
        fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: `{"type":"SET_ON"}`,
                uuid: uuid
            }),
        }).then((response) => {
            if (response.ok) {
                console.log("Relay set successfully:", value);
            } else {
                console.error("Failed to set relay:", response.statusText);
            }
        }).catch((error) => {
            console.error("Error setting relay:", error);
        });
    };

    const setOff = (value) => {
        fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: `{"type":"SET_OFF"}`,
                uuid: uuid
            }),
        }).then((response) => {
            if (response.ok) {
                console.log("Relay set successfully:", value);
            } else {
                console.error("Failed to set relay:", response.statusText);
            }
        }
        ).catch((error) => {
            console.error("Error setting relay:", error);
        });
    };

    return (
        <div
            className="uk-card uk-card-default uk-card-body uk-border-rounded uk-box-shadow-medium"
            style={{
                backgroundColor: "var(--soft-amber)",
                border: "2px solid var(--deep-brown)",
                borderRadius: "10px",
                color: "var(--deep-brown)",
                padding: "20px",
                margin: "10px",
                width: "500px",
                height: "223px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <CardHeader initialName={name} initialLocation={location} battery={batteryLevel} uuid={uuid} />
            <hr style={{ borderColor: "var(--deep-brown)", margin: "10px 0" }} />

            {/* Knob and Brightness Control Buttons */}
            <div className="uk-flex uk-flex-center uk-flex-middle" style={{ position: 'relative' }}>
                {/* Decrement Button */}
                <Button
                    icon="pi pi-minus"
                    className="p-button-rounded p-button-outlined"
                    style={{
                        backgroundColor: 'var(--desert-sand)',
                        color: 'var(--deep-brown)',
                        fontSize: '1.5rem',
                        height: '50px',
                        width: '50px',
                        marginRight: '20px',
                        border: '2px solid var(--deep-brown)'
                    }}
                    onClick={setOff}
                />

                {state === 'HIGH' ? 'HIGH' : 'LOW'}


                {/* Increment Button */}
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-outlined"
                    style={{
                        backgroundColor: 'var(--soft-green)',
                        color: 'var(--deep-brown)',
                        fontSize: '1.5rem',
                        height: '50px',
                        width: '50px',
                        marginLeft: '20px',
                        border: '2px solid var(--deep-brown)'
                    }}
                    onClick={setOn}
                />
            </div>
        </div>
    );
}

export default Relay;
