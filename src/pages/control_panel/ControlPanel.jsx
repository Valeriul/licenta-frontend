import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

import TemperatureHumidityCard from "../../components/TemperatureHumidityCard/TemperatureHumidityCard";
import TemperatureControlCard from "../../components/TemperatureControlCard/TemperatureControlCard";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = "CARD";

function DraggableCard({ peripheral, moveCard }) {
    const [, ref] = useDrag({
        type: ItemType,
        item: { uuid: peripheral.uuid_Peripheral },
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover(item) {
            if (item.uuid !== peripheral.uuid_Peripheral) {
                moveCard(item.uuid, peripheral.uuid_Peripheral);
            }
        },
    });

    const cardRef = (node) => {
        ref(node);
        drop(node);
    };

    if (peripheral.type === "TemperatureHumiditySensor") {
        return (
            <div ref={cardRef} style={{ padding: "10px" }}>
                <TemperatureHumidityCard
                    key={peripheral.uuid_Peripheral}
                    temperature={peripheral.data?.temperature || "N/A"}
                    humidity={peripheral.data?.humidity || "N/A"}
                    battery={peripheral.data?.batteryLevel || "N/A"}
                    uuid={peripheral.uuid_Peripheral}
                    initialName={peripheral.name}
                    initialLocation={peripheral.location}
                />
            </div>
        );
    } else if (peripheral.type === "TemperatureControl") {
        return (
            <div ref={cardRef} style={{ padding: "10px" }}>
                <TemperatureControlCard
                    key={peripheral.uuid_Peripheral}
                    initialTemperature={peripheral.data?.temperature || "N/A"}
                    initialName={peripheral.name}
                    uuid={peripheral.uuid_Peripheral}
                    initialLocation={peripheral.location}
                    battery={peripheral.data?.batteryLevel || "N/A"}
                />
            </div>
        );
    } else {
        return null;
    }
}

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

    const fetchInitializedData = async () => {
        if (userID) {
            try {
                const response = await fetch(
                    process.env.REACT_APP_API_URL + `/Peripheral/initializePeripheral?id_user=${userID}`
                );
            } catch (error) {
                console.error("Error fetching initialized data:", error);
            }
        }
    };

    useEffect(() => {
        const fetchInitializedData = async () => {
            if (userID) {
                try {
                    const response = await fetch(
                        `${process.env.REACT_APP_API_URL}/Peripheral/initializePeripheral?id_user=${userID}`
                    );
                } catch (error) {
                    console.error("Error fetching initialized data:", error);
                }
            }
        };

        // Call the fetch function only once after userID is set
        fetchInitializedData();
    }, [userID]);

    const fetchLoadingData = async () => {
        if (userID) {
            try {
                const response = await fetch(
                    process.env.REACT_APP_API_URL + `/Peripheral/getLoadingData?id_user=${userID}`
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
        }
    };


    useEffect(() => {
        fetchLoadingData();
        const interval = setInterval(fetchLoadingData, 5000);

        return () => clearInterval(interval);
    }, [userID]);


    const moveCard = (fromUuid, toUuid) => {
        const fromIndex = peripherals.findIndex(
            (p) => p.uuid_Peripheral === fromUuid
        );
        const toIndex = peripherals.findIndex((p) => p.uuid_Peripheral === toUuid);

        if (fromIndex !== -1 && toIndex !== -1) {
            const updatedPeripherals = [...peripherals];
            const [movedItem] = updatedPeripherals.splice(fromIndex, 1);
            updatedPeripherals.splice(toIndex, 0, movedItem);


            const peripheralsWithUpdatedPositions = updatedPeripherals.map(
                (peripheral, index) => ({
                    ...peripheral,
                    grid_position: index + 1,
                })
            );


            setPeripherals(peripheralsWithUpdatedPositions);


            saveGridPosition(peripheralsWithUpdatedPositions);
        }
    };


    const saveGridPosition = async (updatedPeripherals) => {
        try {
            console.log(JSON.stringify({
                id_user: userID,
                peripherals: updatedPeripherals.map((p, index) => ({
                    uuid: p.uuid_Peripheral,
                    grid_position: index + 1,
                })),
            }));

            await fetch(process.env.REACT_APP_API_URL + `/Peripheral/saveGridPosition`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_user: userID,
                    peripherals: updatedPeripherals.map((p, index) => ({
                        uuid: p.uuid_Peripheral,
                        grid_position: index + 1,
                    })),
                }),
            });
        } catch (error) {
            console.error("Error saving grid positions:", error);
        }
    };

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

                            {peripherals.sort((a, b) => a.grid_position - b.grid_position).map((peripheral) => (
                                <DraggableCard
                                    key={peripheral.uuid_Peripheral}
                                    peripheral={peripheral}
                                    moveCard={moveCard}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}

export default ControlPanel;
