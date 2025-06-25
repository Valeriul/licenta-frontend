import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import DraggableCard from "../../components/DraggableCard/DraggableCard";
import CardFactory from "../../components/CardFactory/CardFactory";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./ControlPanel.css";

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
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get("uuid");
    const decodedIP = uuid ? decodeBase64Url(uuid) : null;

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

    useEffect(() => {
        let cancelled = false;

        if (!uuid) {
            const id = getUserId();
            if (!id) {
                navigate("/", { replace: true });
            } else {
                setUserID(id);
            }
        } else if (!isUuidLogin) {
            const authenticateWithUUID = async () => {
                try {
                    const response = await fetch(
                        `${process.env.REACT_APP_API_URL}/User/loginWithCentralUUID?uuid=${uuid}`
                    );
                    if (response.ok && !cancelled) {
                        const data = await response.json();
                        login(data);
                        setUserID(data.id_user);
                        setIsUuidLogin(true);
                    } else if (!cancelled && !isUuidLogin) {
                        setTimeout(authenticateWithUUID, 3000);
                    }
                } catch (error) {
                    console.error("Error during UUID authentication:", error);
                    if (!cancelled && !isUuidLogin) {
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
        let isMounted = true;

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

            if (isMounted) {
                setTimeout(fetchLoadingData, 3000);
            }
        };

        fetchLoadingData();

        return () => {
            isMounted = false;
        };
    }, [userID]);

    // moveCard function to handle drag and drop reordering (disabled on small screens)
    const moveCard = useCallback((draggedUuid, targetUuid) => {
        if (draggedUuid === targetUuid || isSmallScreen) return;

        setPeripherals(prevPeripherals => {
            const newPeripherals = [...prevPeripherals];
            
            // Find the indices of the dragged and target cards
            const draggedIndex = newPeripherals.findIndex(p => p.uuid_Peripheral === draggedUuid);
            const targetIndex = newPeripherals.findIndex(p => p.uuid_Peripheral === targetUuid);
            
            if (draggedIndex === -1 || targetIndex === -1) return prevPeripherals;
            
            // Remove the dragged card from its current position
            const [draggedCard] = newPeripherals.splice(draggedIndex, 1);
            
            // Insert the dragged card at the target position
            newPeripherals.splice(targetIndex, 0, draggedCard);
            
            // Update grid_position for all cards based on their new order
            const updatedPeripherals = newPeripherals.map((peripheral, index) => ({
                ...peripheral,
                grid_position: index
            }));
            
            // Send the position updates to the backend
            saveGridPositions(updatedPeripherals);
            
            return updatedPeripherals;
        });
    }, [userID, isSmallScreen]);

    // Function to save grid positions to the backend
    const saveGridPositions = async (updatedPeripherals) => {
        if (!userID || isSmallScreen) return;

        try {
            console.log('Saving grid positions:', JSON.stringify({
                id_user: userID,
                peripherals: updatedPeripherals.map((p, index) => ({
                    uuid: p.uuid_Peripheral,
                    grid_position: index + 1,
                })),
            }));

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/Peripheral/saveGridPosition`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_user: userID,
                        peripherals: updatedPeripherals.map((p, index) => ({
                            uuid: p.uuid_Peripheral,
                            grid_position: index + 1,
                        })),
                    })
                }
            );

            if (response.ok) {
                console.log('Grid positions saved successfully');
            } else {
                console.error('Failed to save grid positions:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving grid positions:', error);
        }
    };

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

    const GridContent = () => (
        <div
            className="uk-grid uk-grid-match"
            style={{
                display: "grid",
                gridTemplateColumns: isSmallScreen ? "1fr" : "repeat(2, 1fr)",
                gap: isSmallScreen ? "10px" : "20px",
                padding: isSmallScreen ? "10px" : "20px",
                marginLeft: isSmallScreen ? "0px" : "20px",
                width: "100%",
                justifyContent: "center",
            }}
        >
            {peripherals.length === 0 ? (
                null
            ) : (
                console.log(peripherals),
                peripherals
                    .sort((a, b) => a.grid_position - b.grid_position)
                    .map((peripheral) =>
                        peripheral.data != null && (
                            isSmallScreen ? (
                                // For small screens, render cards without drag and drop
                                <div key={peripheral.uuid_Peripheral} style={{ padding: "10px" }}>
                                    {CardFactory(peripheral)}
                                </div>
                            ) : (
                                // For normal screens, use draggable cards
                                <DraggableCard 
                                    key={peripheral.uuid_Peripheral} 
                                    peripheral={peripheral} 
                                    moveCard={moveCard}
                                />
                            )
                        )
                    )
            )}
        </div>
    );

    return (
        <div style={{ backgroundColor: "var(--warm-beige)", height: "100%" }}>
            {!isUuidLogin && <Navbar />}
            <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                <div style={{ 
                    backgroundColor: "var(--warm-beige)", 
                    padding: isSmallScreen ? "10px" : "20px", 
                    width: isSmallScreen ? "100%" : "min-content", 
                    alignSelf: "center",
                    maxWidth: isSmallScreen ? "100vw" : "none",
                    overflow: isSmallScreen ? "hidden" : "visible"
                }}>
                    {isSmallScreen ? (
                        // Render without DndProvider for small screens
                        <GridContent />
                    ) : (
                        // Render with DndProvider for normal screens
                        <DndProvider backend={HTML5Backend}>
                            <GridContent />
                        </DndProvider>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ControlPanel;