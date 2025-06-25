import React, { useRef, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import CardFactory from "../CardFactory/CardFactory";

const ItemType = "CARD";

function DraggableCard({ peripheral, moveCard }) {
    const ref = useRef(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

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

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { 
            uuid: peripheral.uuid_Peripheral,
            type: ItemType 
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: !isSmallScreen, // Disable dragging on small screens
    });

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemType,
        drop: (item) => {
            if (item.uuid !== peripheral.uuid_Peripheral && !isSmallScreen) {
                moveCard(item.uuid, peripheral.uuid_Peripheral);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        canDrop: !isSmallScreen, // Disable dropping on small screens
    });

    // Only combine drag and drop refs if not on small screen
    if (!isSmallScreen) {
        drag(drop(ref));
    }

    // Styling based on drag/drop state
    const cardStyle = {
        padding: "10px",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'none',
        transition: 'all 0.3s ease',
        cursor: isSmallScreen ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        position: 'relative',
        zIndex: isDragging ? 1000 : 1,
    };

    // Add visual feedback for drop zones only if not on small screen
    if (isOver && canDrop && !isSmallScreen) {
        cardStyle.transform = 'scale(1.05)';
        cardStyle.boxShadow = '0 8px 20px rgba(59, 44, 53, 0.3)';
    }

    return (
        <div ref={ref} style={cardStyle}>
            {/* Visual indicator when dragging over - only show on larger screens */}
            {isOver && canDrop && !isSmallScreen && (
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