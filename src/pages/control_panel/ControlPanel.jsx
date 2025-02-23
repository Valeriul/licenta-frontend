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
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get("uuid");
    const decodedIP = uuid ? decodeBase64Url(uuid) : null;

    useEffect(() => {
        let cancelled = false;

        if (!uuid) {
            const id = getUserId();
            if (!id) {
                navigate("/", { replace: true });
            } else {
                setUserID(id);
            }
        } else if (!isUuidLogin) { // only run authentication if not already logged in via UUID
            const authenticateWithUUID = async () => {
                try {
                    const response = await fetch(
                        `${process.env.REACT_APP_API_URL}/User/loginWithCentralUUID?uuid=${uuid}`
                    );
                    if (response.ok && !cancelled) {
                        const data = await response.json();
                        login(data);
                        setUserID(data.id_user);
                        setIsUuidLogin(true); // mark as authenticated so we stop retrying
                    } else if (!cancelled && !isUuidLogin) {
                        // If authentication fails, schedule a retry only if not already authenticated
                        setTimeout(authenticateWithUUID, 3000);
                    }
                } catch (error) {
                    console.error("Error during UUID authentication:", error);
                    if (!cancelled && !isUuidLogin) {
                        // Retry in case of an error
                        setTimeout(authenticateWithUUID, 3000);
                    }
                }
            };

            authenticateWithUUID();
        }

        return () => {
            cancelled = true;
        };
    }, [uuid, isUuidLogin, getUserId, navigate, login]);


    useEffect(() => {
        if (!userID) return;

        const fetchInitializedData = async () => {
            try {
                await fetch(`${process.env.REACT_APP_API_URL}/Peripheral/initializePeripheral?id_user=${userID}`);
            } catch (error) {
                console.error("Error fetching initialized data:", error);
            }
        };

        //fetchInitializedData();
    }, [userID]);

    useEffect(() => {
        let isMounted = true; // to prevent state updates if the component unmounts

        const fetchLoadingData = async () => {
            if (!userID || !isMounted) return;

            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/Peripheral/getLoadingData?id_user=${userID}`
                );
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted) {
                        setPeripherals(data);
                    }
                } else {
                    console.error("Failed to fetch loading data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching loading data:", error);
            }

            // Schedule the next fetch 3 seconds after the current one completes
            if (isMounted) {
                setTimeout(fetchLoadingData, 3000);
            }
        };

        // Start the polling
        fetchLoadingData();

        // Cleanup function to prevent setting state on an unmounted component
        return () => {
            isMounted = false;
        };
    }, [userID]);

    if (uuid && !isUuidLogin) {
        const ipSegments = decodedIP ? decodedIP.split(".") : ["", "", "", ""];

        return (
            <div className="ip-display-container">
                <p className="connected-text">Input this IP into the verification page</p>
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
                            {peripherals.length === 0 ? (
                                null
                            ) : (
                                console.log(peripherals),
                                peripherals
                                    .sort((a, b) => a.grid_position - b.grid_position)
                                    .map((peripheral) => (
                                        <DraggableCard key={peripheral.uuid_Peripheral} peripheral={peripheral} />
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}

export default ControlPanel;
