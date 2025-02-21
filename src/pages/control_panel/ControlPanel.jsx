import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import DraggableCard from "../../components/DraggableCard/DraggableCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function ControlPanel() {
    const { getUserId } = useUser();
    const [userID, setUserID] = useState(null);
    const [peripherals, setPeripherals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const id = getUserId();
        if (!id) {
            navigate("/", { replace: true });
        } else {
            setUserID(id);
        }
    }, [getUserId, navigate]);

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

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ backgroundColor: "var(--warm-beige)", height: "100%" }}>
                <Navbar />
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