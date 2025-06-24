import React, { useState, useRef, useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Knob } from 'primereact/knob';
import { Button } from 'primereact/button';
import { useUser } from '../../contexts/UserContext';
import CardHeader from "../CardHeader/CardHeader";

// LED Component
const LEDIndicator = ({ brightness = 50, color = '#ffd700', size = 60 }) => {
    const normalizedBrightness = Math.max(0, Math.min(100, brightness));
    const opacity = normalizedBrightness / 100;
    const glowIntensity = normalizedBrightness / 100;

    const ledStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: opacity > 0 ? color : '#333',
        opacity: opacity > 0 ? 0.3 + (opacity * 0.7) : 0.3,
        boxShadow: opacity > 0
            ? `0 0 ${10 * glowIntensity}px ${color}, 
               0 0 ${20 * glowIntensity}px ${color}, 
               0 0 ${30 * glowIntensity}px ${color},
               inset 0 0 ${5 * glowIntensity}px rgba(255,255,255,0.3)`
            : 'inset 0 0 5px rgba(0,0,0,0.5)',
        border: `2px solid ${opacity > 0 ? color : '#666'}`,
        transition: 'all 0.3s ease',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px'
    };

    const highlightStyle = {
        width: `${size * 0.3}px`,
        height: `${size * 0.3}px`,
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.6)',
        opacity: opacity * 0.8,
        position: 'absolute',
        top: `${size * 0.15}px`,
        left: `${size * 0.25}px`,
        transition: 'opacity 0.3s ease'
    };

    return (
        <div style={ledStyle}>
            <div style={highlightStyle}></div>
        </div>
    );
};

function Led({ initialBrightness, initialName, initialLocation, battery, uuid, initialColor = '#4ade80' }) {
    const [brightness, setBrightness] = useState(initialBrightness);
    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialLocation);
    const [batteryLevel, setBatteryLevel] = useState(battery);
    const [ledColor, setLedColor] = useState(initialColor);

    const { getUserId } = useUser();
    const userID = getUserId();

    const bufferRef = useRef([]);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setBrightness(initialBrightness);
        setName(initialName);
        setLocation(initialLocation);
        setBatteryLevel(battery);
        setLedColor(initialColor);
    }, [initialBrightness, initialName, initialLocation, battery, initialColor]);


    const sendColorRequest = (color) => {
        fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: `{"type":"SET_COLOR","value":"${color}"}`,
                uuid: uuid
            }),
        }).then((response) => {
            if (response.ok) {
                console.log("Color set successfully:", color);
            } else {
                console.error("Failed to set color:", response.statusText);
            }
        }).catch((error) => {
            console.error("Error setting color:", error);
        });
    };

    const handleColorChange = (color) => {
        setLedColor(color);
        sendColorRequest(color);
        setShowColorPicker(false);
    };
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
        const newValue = Math.min(brightness + 1, 100);
        setBrightness(newValue);
        bufferBrightnessUpdate(newValue);
    };

    const handleDecrementBrightness = () => {
        const newValue = Math.max(brightness - 1, 0);
        setBrightness(newValue);
        bufferBrightnessUpdate(newValue);
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

                {/* Knob Control with LED in center */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Knob
                        value={brightness}
                        size={100}
                        min={0}
                        max={100}
                        valueColor="var(--soft-green)"
                        rangeColor="var(--muted-olive)"
                        textColor="transparent" // Hide the default text
                        strokeWidth={10}
                        onChange={(e) => bufferBrightnessUpdate(e.value)}
                        showValue={false} // Disable default value display
                    />

                    {/* LED and Percentage Display in center of knob */}
                    <div
                        style={{
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px'
                        }}
                    >
                        <LEDIndicator brightness={brightness} color={ledColor} size={50} />
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: 'var(--deep-brown)',
                                textAlign: 'center',
                                marginTop: '2px'
                            }}
                        >
                            {brightness}%
                        </div>
                    </div>
                </div>

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