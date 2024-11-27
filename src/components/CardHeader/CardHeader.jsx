import React, { useState } from "react";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import BatteryGauge from "react-battery-gauge";
import "../../styles.css";
import "./CardHeader.css";
import { useUser } from "../../contexts/UserContext";

function CardHeader({ initialName, initialLocation, battery, uuid }) {
    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialLocation);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingLocation, setIsEditingLocation] = useState(false);

    
    const { getUserId } = useUser();
    const userId = getUserId();

    const renamePeripheral = async (newName) => {
        try {
            const response = await fetch(
                process.env.REACT_APP_API_URL +`/Peripheral/renamePeripheral?id_user=${userId}&uuid=${uuid}&newName=${encodeURIComponent(newName)}`,
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
                process.env.REACT_APP_API_URL +`/Peripheral/relocatePeripheral?id_user=${userId}&uuid=${uuid}&newLocation=${encodeURIComponent(newLocation)}`,
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

    return (
        <div className="uk-flex uk-flex-between uk-flex-middle">
            {}
            <div>
                {}
                {isEditingName ? (
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
                        <i
                            className="pi pi-pencil"
                            style={{ marginLeft: "8px", cursor: "pointer" }}
                            onClick={() => setIsEditingName(true)}
                        />
                    </h3>
                )}

                {}
                {isEditingLocation ? (
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
                    <span className="uk-text-muted" style={{ fontSize: "0.9rem", cursor: "pointer" }}>
                        {location}
                        <i
                            className="pi pi-pencil"
                            style={{ marginLeft: "8px", cursor: "pointer" }}
                            onClick={() => setIsEditingLocation(true)}
                        />
                    </span>
                )}
            </div>

            {}
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
    );
}

export default CardHeader;
