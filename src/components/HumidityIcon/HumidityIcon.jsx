import React from "react";
import '../../styles.css';
import humidityIcon from '../../assets/img/humidity.png';

function HumidityIcon({ humidity }) {
    return (
        <div
            className="humidity-icon"
            style={{
                position: "relative",
                width: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0px",
                margin: "0px",
            }}
        >
            {}
            <span
                style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "var(--deep-brown)",
                    position: "absolute",
                    bottom: "20px",
                    left: "5px",
                    zIndex: 3,
                }}
            >
                {humidity}%
            </span>

            {}
            <img
                src={humidityIcon}
                alt="Humidity Icon"
                width={100}
                style={{
                    position: "relative",
                    zIndex: 2,
                    left: "0px",
                    margin: "0px",
                    padding: "0px",
                }}
            />
        </div>
    );
}

export default HumidityIcon;
