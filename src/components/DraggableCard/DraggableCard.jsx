import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import CardFactory from "../CardFactory/CardFactory";

const ItemType = "CARD";

function DraggableCard({ peripheral, moveCard }) {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { 
            uuid: peripheral.uuid_Peripheral,
            type: ItemType 
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemType,
        drop: (item) => {
            if (item.uuid !== peripheral.uuid_Peripheral) {
                moveCard(item.uuid, peripheral.uuid_Peripheral);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    // Combine drag and drop refs
    drag(drop(ref));

    // Styling based on drag/drop state
    const cardStyle = {
        padding: "10px",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'none',
        transition: 'all 0.3s ease',
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'relative',
        zIndex: isDragging ? 1000 : 1,
    };

    // Add visual feedback for drop zones
    if (isOver && canDrop) {
        cardStyle.transform = 'scale(1.05)';
        cardStyle.boxShadow = '0 8px 20px rgba(59, 44, 53, 0.3)';
    }

    return (
        <div ref={ref} style={cardStyle}>
            {/* Visual indicator when dragging over */}
            {isOver && canDrop && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'var(--soft-green)',
                        opacity: 0.2,
                        borderRadius: '10px',
                        border: '2px dashed var(--deep-brown)',
                        zIndex: -1,
                        pointerEvents: 'none',
                    }}
                />
            )}
            
            {CardFactory(peripheral)}
        </div>
    );
}

export default DraggableCard;