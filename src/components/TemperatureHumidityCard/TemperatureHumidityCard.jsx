import React from 'react';
import '../../styles.css';
import HumidityIcon from "../HumidityIcon/HumidityIcon";
import TemperatureIcon from "../TemperatureIcon/TemperatureIcon";
import CardHeader from "../CardHeader/CardHeader";

function TemperatureHumidityCard({ temperature, humidity, battery, initialName, initialLocation, uuid }) {
    return (
        <div
            className="uk-card uk-card-default uk-card-body uk-border-rounded uk-box-shadow-medium"
            style={{
                backgroundColor: "var(--soft-amber)",
                border: "2px solid var(--deep-brown)",
                padding: "20px",
                margin: "10px",
                width: "500px",
                height: "223px"
            }}
        >
            <CardHeader initialName={initialName} initialLocation={initialLocation} battery={battery} uuid={uuid}/>
            <hr style={{ borderColor: "var(--deep-brown)", margin: "10px 0" }} />
            <div className="uk-flex uk-flex-center uk-flex-around">
                <TemperatureIcon temperature={temperature} />
                <HumidityIcon humidity={humidity} />
            </div>
        </div>
    );
}

export default TemperatureHumidityCard;
