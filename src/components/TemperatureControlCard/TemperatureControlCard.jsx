import React, { useState } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Knob } from 'primereact/knob';
import { Button } from 'primereact/button';
import { useUser } from '../../contexts/UserContext';
import BatteryGauge from 'react-battery-gauge';
import CardHeader from "../CardHeader/CardHeader";

function TemperatureControlCard({ initialTemperature, initialName, initialLocation, battery, uuid }) {
    const [temperature, setTemperature] = useState(initialTemperature);
    const { getUserId } = useUser();
    const userID = getUserId();

    const handleSetTemperature = (value) => {
        setTemperature(value);

        fetch("http://localhost:5000" +`/Peripheral/makeControlCommand?id_user=${userID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: "{\"type\":\"SET_TEMPERATURE\",\"value\":" + value + "}",
                uuid: `${uuid}`
            }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Temperature set successfully");
                } else {
                    console.error("Failed to set temperature:", response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error setting temperature:", error);
            }
            );
    };

    const handleIncrementTemperature = () => {
        setTemperature(prev => Math.min(prev + 1, 35));

        fetch("http://localhost:5000" +`/Peripheral/makeControlCommand?id_user=${userID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: "{\"type\":\"INCREASE_TEMPERATURE\"}",
                uuid: `${uuid}`
            }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Temperature incremented successfully");
                } else {
                    console.error("Failed to increment temperature:", response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error incrementing temperature:", error);
            }
            );
    };

    const handleDecrementTemperature = () => {
        setTemperature(prev => Math.max(prev - 1, 15));

        fetch("http://localhost:5000" +`/Peripheral/makeControlCommand?id_user=${userID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: "{\"type\":\"DECREASE_TEMPERATURE\"}",
                uuid: `${uuid}`
            }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Temperature decremented successfully");
                } else {
                    console.error("Failed to decrement temperature:", response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error decrementing temperature:", error);
            }
            );
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
            <CardHeader initialName={initialName} initialLocation={initialLocation} battery={battery} />
            <hr style={{ borderColor: "var(--deep-brown)", margin: "10px 0" }} />

            {/* Knob and Temperature Control Buttons */}
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
                    onClick={handleDecrementTemperature}
                />

                {/* Knob Control */}
                <Knob
                    value={temperature}
                    size={100}
                    min={15}
                    max={35}
                    valueColor="var(--soft-green)"
                    rangeColor="var(--muted-olive)"
                    textColor="var(--deep-brown)"
                    strokeWidth={10}
                    onChange={(e) => handleSetTemperature(e.value)}
                    valueTemplate="{value}°C"
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
                    onClick={handleIncrementTemperature}
                />
            </div>
        </div>
    );
}

export default TemperatureControlCard;
