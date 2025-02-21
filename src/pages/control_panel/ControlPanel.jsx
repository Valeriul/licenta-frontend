import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import DraggableCard from "../../components/DraggableCard/DraggableCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./ControlPanel.css"; // Ensure styling consistency

function decodeBase64Url(encoded) {
    try {
        const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(base64);
        const match = decoded.match(/^ws:\/\/([\d.]+):5002(\/ws)?$/);
        return match ? match[1] : null;
    } catch (error) {
        console.error("Invalid Base64 encoding:", error);
        return null;
    }
}

function ControlPanel() {
    const { getUserId, login } = useUser();
    const [userID, setUserID] = useState(null);
    const [peripherals, setPeripherals] = useState([]);
    const [isUuidLogin, setIsUuidLogin] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get("uuid");
    const decodedIP = uuid ? decodeBase64Url(uuid) : null;

    useEffect(() => {
        if (!uuid) {
            const id = getUserId();
            if (!id) {
                navigate("/", { replace: true });
            } else {
                setUserID(id);
            }
        } else {
            setIsAuthenticating(true);
            const authenticateWithUUID = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/User/loginWithCentralUUID?uuid=${uuid}`);
                    if (response.ok) {
                        const data = await response.json();
                        login(data.id_user);
                        setUserID(data.id_user);
                        setIsUuidLogin(true);
                        setIsAuthenticating(false);
                    } else {
                        console.error("UUID authentication failed");
                        setIsAuthenticating(false);
                    }
                } catch (error) {
                    console.error("Error during UUID authentication:", error);
                    setIsAuthenticating(false);
                }
            };
            authenticateWithUUID();
        }
    }, [getUserId, navigate, uuid, login]);

    useEffect(() => {
        if (!userID) return;

        const fetchInitializedData = async () => {
            try {
                await fetch(`${process.env.REACT_APP_API_URL}/Peripheral/initializePeripheral?id_user=${userID}`);
            } catch (error) {
                console.error("Error fetching initialized data:", error);
            }
        };

        fetchInitializedData();
    }, [userID]);

    const fetchLoadingData = async () => {
        if (!userID) return;

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/Peripheral/getLoadingData?id_user=${userID}`
            );
            if (response.ok) {
                const data = await response.json();
                setPeripherals(data);
            } else {
                console.error("Failed to fetch loading data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching loading data:", error);
        }
    };

    useEffect(() => {
        fetchLoadingData();
        const interval = setInterval(fetchLoadingData, 5000);
        return () => clearInterval(interval);
    }, [userID]);

    if (isAuthenticating) {
        return (
            <div className="ip-display-container">
                <p className="connecting-text">Connecting to device...</p>
            </div>
        );
    }

    if (uuid && !isUuidLogin) {
        const ipSegments = decodedIP ? decodedIP.split(".") : ["", "", "", ""];

        return (
            <div className="ip-display-container">
                <p className="connected-text">Connected to device at:</p>
                <div className="ip-display">
                    <span className="ip-segment">{ipSegments[0]}</span>
                    <span className="dot-separator">.</span>
                    <span className="ip-segment">{ipSegments[1]}</span>
                    <span className="dot-separator">.</span>
                    <span className="ip-segment">{ipSegments[2]}</span>
                    <span className="dot-separator">.</span>
                    <span className="ip-segment">{ipSegments[3]}</span>
                </div>
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ backgroundColor: "var(--warm-beige)", height: "100%" }}>
                {!isUuidLogin && <Navbar />}
                <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                    <div style={{ backgroundColor: "var(--warm-beige)", padding: "20px", width: "min-content", alignSelf: "center" }}>
                        <div
                            className="uk-grid uk-grid-match"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "20px",
                                padding: "20px",
                                marginLeft: "20px",
                            }}
                        >
                            {peripherals
                                .sort((a, b) => a.grid_position - b.grid_position)
                                .map((peripheral) => (
                                    <DraggableCard key={peripheral.uuid_Peripheral} peripheral={peripheral} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}

export default ControlPanel;
