import React, { useState, useRef, useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Knob } from 'primereact/knob';
import { Button } from 'primereact/button';
import { useUser } from '../../contexts/UserContext';
import CardHeader from "../CardHeader/CardHeader";

function TemperatureSensor({ initialTemperature, initialName, initialLocation, battery, uuid }) {
    const [temperature, setTemperature] = useState(initialTemperature);
    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialLocation);
    const [batteryLevel, setBatteryLevel] = useState(battery);

    const { getUserId } = useUser();
    const userID = getUserId();
    

    useEffect(() => {
        setTemperature(initialTemperature);
        setName(initialName);
        setLocation(initialLocation);
        setBatteryLevel(battery);
    }, [initialTemperature, initialName, initialLocation, battery]);

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

            <Knob
                value={temperature}
                size={100}
                min={0}
                max={500}
                valueColor="var(--soft-green)"
                rangeColor="var(--muted-olive)"
                className="uk-flex uk-flex-center"
                style={{ margin: '0 auto' }}
            />
        </div>
    );
}

export default GasSensor;
