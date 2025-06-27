import React, { useState, useEffect } from "react";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import BatteryGauge from "react-battery-gauge";
import { Button } from 'primereact/button';
import { useModal } from "../../contexts/ModalContext";
import "../../styles.css";
import "./CardHeader.css";
import { useUser } from "../../contexts/UserContext";

function CardHeader({ 
    initialName, 
    initialLocation, 
    battery, 
    uuid, 
    deviceType = 'Unknown',
    additionalData = {} 
}) {
    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialLocation);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const { openDeviceModal } = useModal();
    const { getUserId } = useUser();
    const userId = getUserId();

    // Check for 800x480 resolution
    useEffect(() => {
        const checkScreenSize = () => {
            const isSmall = window.innerWidth <= 800 && window.innerHeight <= 480;
            setIsSmallScreen(isSmall);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Update local state when props change
    useEffect(() => {
        setName(initialName);
        setLocation(initialLocation);
    }, [initialName, initialLocation]);

    const renamePeripheral = async (newName) => {
        try {
            const response = await fetch(
                process.env.REACT_APP_API_URL + `/Peripheral/renamePeripheral?id_user=${userId}&uuid=${uuid}&newName=${encodeURIComponent(newName)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to rename peripheral");
            }

            const result = await response.json();
            console.log("Rename Successful:", result);
        } catch (error) {
            console.error("Error renaming peripheral:", error.message);
        }
    };

    const relocatePeripheral = async (newLocation) => {
        try {
            const response = await fetch(
                process.env.REACT_APP_API_URL + `/Peripheral/relocatePeripheral?id_user=${userId}&uuid=${uuid}&newLocation=${encodeURIComponent(newLocation)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to relocate peripheral");
            }

            const result = await response.json();
            console.log("Relocate Successful:", result);
        } catch (error) {
            console.error("Error relocating peripheral:", error.message);
        }
    };

    const handleNameBlur = async () => {
        setIsEditingName(false);
        await renamePeripheral(name);
    };

    const handleNameKeyPress = async (e) => {
        if (e.key === "Enter") {
            setIsEditingName(false);
            await renamePeripheral(name);
        }
    };

    const handleLocationBlur = async () => {
        setIsEditingLocation(false);
        await relocatePeripheral(location);
    };

    const handleLocationKeyPress = async (e) => {
        if (e.key === "Enter") {
            setIsEditingLocation(false);
            await relocatePeripheral(location);
        }
    };

    const handleOpenModal = () => {
        openDeviceModal({
            name,
            location,
            uuid,
            battery,
            deviceType,
            additionalData
        });
    };

    return (
        <div className="uk-flex uk-flex-between uk-flex-middle">
            {/* Left side - Name and Location */}
            <div>
                {/* Device Name */}
                {isEditingName && !isSmallScreen ? (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleNameBlur}
                        onKeyPress={handleNameKeyPress}
                        autoFocus
                        className="custom-input"
                    />
                ) : (
                    <h3 style={{ margin: 0, display: "flex", alignItems: "center" }}>
                        {name}
                        {!isSmallScreen && (
                            <i
                                className="pi pi-pencil"
                                style={{ marginLeft: "8px", cursor: "pointer" }}
                                onClick={() => setIsEditingName(true)}
                            />
                        )}
                    </h3>
                )}

                {/* Device Location */}
                {isEditingLocation && !isSmallScreen ? (
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onBlur={handleLocationBlur}
                        onKeyPress={handleLocationKeyPress}
                        autoFocus
                        className="custom-input"
                        style={{ fontSize: "0.9rem" }}
                    />
                ) : (
                    <span className="uk-text-muted" style={{ fontSize: "0.9rem", cursor: isSmallScreen ? "default" : "pointer" }}>
                        {location}
                        {!isSmallScreen && (
                            <i
                                className="pi pi-pencil"
                                style={{ marginLeft: "8px", cursor: "pointer" }}
                                onClick={() => setIsEditingLocation(true)}
                            />
                        )}
                    </span>
                )}
            </div>

            {/* Right side - Battery and Expand Button */}
            <div className="uk-flex uk-flex-middle" style={{ gap: "10px" }}>
                {/* Fullscreen Modal Button */}
                <Button
                    icon="pi pi-chart-line"
                    className="p-button-rounded p-button-outlined"
                    onClick={handleOpenModal}
                    tooltip="View Details"
                    tooltipOptions={{ position: 'left' }}
                    style={{
                        backgroundColor: 'transparent',
                        border: '2px solid var(--deep-brown)',
                        color: 'var(--deep-brown)',
                        width: '35px',
                        height: '35px',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--soft-green)';
                        e.target.style.color = 'var(--warm-beige)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--deep-brown)';
                    }}
                />

                {/* Battery Gauge */}
                <BatteryGauge
                    value={battery}
                    width={60}
                    height={40}
                    fontSize={20}
                    showPercentage={true}
                    color={"#000"}
                    style={{ padding: "0", margin: "0" }}
                />
            </div>
        </div>
    );
}

export default CardHeader;