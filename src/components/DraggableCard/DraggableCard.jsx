import React, { useRef, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import CardFactory from "../CardFactory/CardFactory";

const ItemType = "CARD";

function DraggableCard({ peripheral, moveCard }) {
    const ref = useRef(null);
    const dragHandleRef = useRef(null);
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

    const [{ isDragging }, drag, dragPreview] = useDrag({
        type: ItemType,
        item: () => ({
            uuid: peripheral.uuid_Peripheral,
            type: ItemType 
        }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => !isSmallScreen,
    });

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemType,
        drop: (item, monitor) => {
            if (!monitor.didDrop() && item.uuid !== peripheral.uuid_Peripheral && !isSmallScreen) {
                moveCard(item.uuid, peripheral.uuid_Peripheral);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        canDrop: (item) => !isSmallScreen && item.uuid !== peripheral.uuid_Peripheral,
    });

    // Attach drag to the handle only, drop to the whole card
    useEffect(() => {
        if (!isSmallScreen) {
            if (dragHandleRef.current) {
                drag(dragHandleRef.current); // Only the handle is draggable
            }
            if (ref.current) {
                drop(ref.current); // Whole card is a drop zone
                dragPreview(ref.current); // Use whole card for drag preview
            }
        }
    }, [drag, drop, dragPreview, isSmallScreen]);

    // Styling based on drag/drop state
    const cardStyle = {
        padding: "10px",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(2deg)' : 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: isDragging ? 1000 : 1,
    };

    // Add visual feedback for drop zones only if not on small screen
    if (isOver && canDrop && !isSmallScreen) {
        cardStyle.transform = 'scale(1.05)';
        cardStyle.boxShadow = '0 8px 20px rgba(59, 44, 53, 0.3)';
    }

    const dragHandleStyle = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '24px',
        height: '24px',
        cursor: isSmallScreen ? 'default' : 'grab',
        zIndex: 10,
        opacity: isSmallScreen ? 0 : 0.6,
        transition: 'opacity 0.3s ease',
        pointerEvents: isSmallScreen ? 'none' : 'auto',
    };

    // Create a simple drag handle icon as SVG (you can replace this with a PNG)
    const DragHandleIcon = () => (
        <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            style={{ 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            }}
        >
            {/* Background circle */}
            <circle 
                cx="12" 
                cy="12" 
                r="10" 
                fill="var(--deep-brown)" 
                opacity="0.8"
            />
            {/* Drag dots pattern */}
            <circle cx="8" cy="8" r="1.5" fill="var(--warm-beige)" />
            <circle cx="12" cy="8" r="1.5" fill="var(--warm-beige)" />
            <circle cx="16" cy="8" r="1.5" fill="var(--warm-beige)" />
            <circle cx="8" cy="12" r="1.5" fill="var(--warm-beige)" />
            <circle cx="12" cy="12" r="1.5" fill="var(--warm-beige)" />
            <circle cx="16" cy="12" r="1.5" fill="var(--warm-beige)" />
            <circle cx="8" cy="16" r="1.5" fill="var(--warm-beige)" />
            <circle cx="12" cy="16" r="1.5" fill="var(--warm-beige)" />
            <circle cx="16" cy="16" r="1.5" fill="var(--warm-beige)" />
        </svg>
    );

    return (
        <div ref={ref} style={cardStyle}>
            {/* Drag Handle in top right corner */}
            {!isSmallScreen && (
                <div 
                    ref={dragHandleRef}
                    style={dragHandleStyle}
                    onMouseEnter={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.cursor = isDragging ? 'grabbing' : 'grab';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.opacity = '0.6';
                    }}
                    title="Drag to reorder"
                >
                    <DragHandleIcon />
                </div>
            )}

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