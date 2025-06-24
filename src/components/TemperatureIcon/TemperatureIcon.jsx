import React from "react";
import '../../styles.css';
import temperatureIcon from '../../assets/img/temperature.png';

function TemperatureIcon({ temperature }) {

    const getClipPathValue = (temp) => {
        const height = Math.min(100, Math.max(20, temp * 2));
        return `${100 - height}px`;
    };

    return (
        <div
            className="temperature-icon"
            style={{
                position: "relative",
                width: "116px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0px",
                margin: "0px",
            }}
        >
            { }
            <div
                style={{
                    background: "linear-gradient(to top, rgb(25, 12, 199), rgb(255, 209, 161), rgb(255, 0, 0))",
                    height: "100px",
                    width: "62px",
                    position: "absolute",
                    bottom: "0px",
                    left: "49px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    clipPath: `inset(${getClipPathValue(temperature)} 0px 0px)`,
                    zIndex: 2,
                }}
            ></div>

            <div
                style={{
                    background: "var(--warm-beige)",
                    height: "100px",
                    width: "62px",
                    position: "absolute",
                    bottom: "0px",
                    left: "49px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    zIndex: 1,
                }}
            ></div>

            <img
                src={temperatureIcon}
                alt="Temperature Icon"
                width={100}
                style={{
                    position: "relative",
                    zIndex: 2,
                    left: "8px",
                    margin: "0px",
                    padding: "0px",
                }}
            />

            <span
                style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "var(--deep-brown)",
                    position: "absolute",
                    bottom: "5px",
                    left: "-30px",
                    textAlign: "right",
                    width: "80px",
                    zIndex: 4,
                }}
            >
                {temperature}°C
            </span>
        </div>
    );
}

export default TemperatureIcon;
