import React, { useState, useRef, useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Knob } from 'primereact/knob';
import { Button } from 'primereact/button';
import { useUser } from '../../contexts/UserContext';
import CardHeader from "../CardHeader/CardHeader";

function Led({ initialBrightness, initialName, initialLocation, battery, uuid }) {
    const [brightness, setBrightness] = useState(initialBrightness);
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
    

    const sendBrightnessRequest = (value) => {
        fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: `{"type":"SET_BRIGHTNESS","value":${value}}`,
                uuid: uuid
            }),
        }).then((response) => {
            if (response.ok) {
                console.log("Brightness set successfully:", value);
            } else {
                console.error("Failed to set brightness:", response.statusText);
            }
        }).catch((error) => {
            console.error("Error setting brightness:", error);
        });
    };

    const bufferBrightnessUpdate = (value) => {
        setBrightness(value);
        bufferRef.current.push(value);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (bufferRef.current.length > 0) {
                const lastValue = bufferRef.current[bufferRef.current.length - 1];
                sendBrightnessRequest(lastValue);
                bufferRef.current = []; // Clear buffer
            }
        }, 500);
    };

    const handleIncrementBrightness = () => {
        setBrightness(prev => Math.min(prev + 1, 100));
        bufferBrightnessUpdate(Math.min(brightness + 1, 100));
    };

    const handleDecrementBrightness = () => {
        setBrightness(prev => Math.max(prev - 1, 0));
        bufferBrightnessUpdate(Math.max(brightness - 1, 0));
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
                    onClick={handleDecrementBrightness}
                />

                {/* Knob Control */}
                <Knob
                    value={brightness}
                    size={100}
                    min={0}
                    max={100}
                    valueColor="var(--soft-green)"
                    rangeColor="var(--muted-olive)"
                    textColor="var(--deep-brown)"
                    strokeWidth={10}
                    onChange={(e) => bufferBrightnessUpdate(e.value)}
                    valueTemplate="{value}%"
                    showValue
                />

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
                    onClick={handleIncrementBrightness}
                />
            </div>
        </div>
    );
}

export default Led;
