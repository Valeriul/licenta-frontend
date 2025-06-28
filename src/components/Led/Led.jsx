import React, { useState, useRef, useEffect, useCallback } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { useUser } from '../../contexts/UserContext';
import { usePendingState } from '../../contexts/PendingStateContext';
import CardHeader from "../CardHeader/CardHeader";

// Custom Knob Component
const CustomKnob = ({ 
    value = 50, 
    min = 0, 
    max = 100, 
    size = 100, 
    onChange, 
    onChangeComplete,
    disabled = false,
    strokeWidth = 10,
    valueColor = '#4ade80',
    rangeColor = '#e5e7eb'
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const knobRef = useRef(null);
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - strokeWidth - 10) / 2; // Reduced radius to prevent clipping

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const normalizeValue = (val) => Math.max(min, Math.min(max, val));

    const valueToAngle = (val) => {
        const normalizedValue = (val - min) / (max - min);
        // Map 0-1 to 135° to 405° (270° arc: 5π/4 to -π/4, corrected by -π/2)
        // 0% = 135° (3π/4), 25% = 180° (π), 50% = 225° (5π/4), 75% = 270° (3π/2), 100% = 315° (7π/4)
        return 135 + (normalizedValue * 270);
    };

    const angleToValue = (angle) => {
        // Convert angle to our 270° range starting from 135°
        let normalizedAngle = angle;
        
        // Handle angle wrapping
        if (normalizedAngle < 0) normalizedAngle += 360;
        
        // Adjust angle to our coordinate system starting from 135°
        let adjustedAngle = normalizedAngle - 135;
        if (adjustedAngle < 0) adjustedAngle += 360;
        
        // Clamp to our 270° range
        if (adjustedAngle > 270) {
            // Choose the closest endpoint
            adjustedAngle = adjustedAngle > 315 ? 0 : 270;
        }
        
        // Convert angle to value: 0° offset = 0%, 270° offset = 100%
        const normalizedValue = adjustedAngle / 270;
        const valueRange = max - min;
        return Math.round(min + normalizedValue * valueRange);
    };

    const getAngleFromPoint = (clientX, clientY) => {
        if (!knobRef.current) return 0;
        
        const rect = knobRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        
        return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    };

    const handleMouseDown = useCallback((e) => {
        if (disabled) return;
        
        e.preventDefault();
        setIsDragging(true);
        
        const angle = getAngleFromPoint(e.clientX, e.clientY);
        const newValue = normalizeValue(angleToValue(angle));
        setCurrentValue(newValue);
        onChange && onChange({ value: newValue });
    }, [disabled, onChange, min, max]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || disabled) return;
        
        e.preventDefault();
        const angle = getAngleFromPoint(e.clientX, e.clientY);
        const newValue = normalizeValue(angleToValue(angle));
        setCurrentValue(newValue);
        onChange && onChange({ value: newValue });
    }, [isDragging, disabled, onChange, min, max]);

    const handleMouseUp = useCallback((e) => {
        if (!isDragging) return;
        
        setIsDragging(false);
        onChangeComplete && onChangeComplete({ value: currentValue });
    }, [isDragging, currentValue, onChangeComplete]);

    // Touch events
    const handleTouchStart = useCallback((e) => {
        if (disabled) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        setIsDragging(true);
        
        const angle = getAngleFromPoint(touch.clientX, touch.clientY);
        const newValue = normalizeValue(angleToValue(angle));
        setCurrentValue(newValue);
        onChange && onChange({ value: newValue });
    }, [disabled, onChange, min, max]);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging || disabled) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const angle = getAngleFromPoint(touch.clientX, touch.clientY);
        const newValue = normalizeValue(angleToValue(angle));
        setCurrentValue(newValue);
        onChange && onChange({ value: newValue });
    }, [isDragging, disabled, onChange, min, max]);

    const handleTouchEnd = useCallback((e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        setIsDragging(false);
        onChangeComplete && onChangeComplete({ value: currentValue });
    }, [isDragging, currentValue, onChangeComplete]);

    // Global event listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    const currentAngle = valueToAngle(currentValue);
    
    // Create SVG path for the arc
    const createArcPath = (startAngle, endAngle, radius, centerX, centerY) => {
        // Convert to actual end angle (handling wrap-around)
        let actualEndAngle = endAngle;
        while (actualEndAngle >= 360) {
            actualEndAngle -= 360;
        }
        
        const start = {
            x: centerX + radius * Math.cos((startAngle * Math.PI) / 180),
            y: centerY + radius * Math.sin((startAngle * Math.PI) / 180)
        };
        const end = {
            x: centerX + radius * Math.cos((actualEndAngle * Math.PI) / 180),
            y: centerY + radius * Math.sin((actualEndAngle * Math.PI) / 180)
        };
        
        // Calculate arc span
        let arcSpan = endAngle - startAngle;
        while (arcSpan < 0) arcSpan += 360;
        while (arcSpan >= 360) arcSpan -= 360;
        
        const largeArcFlag = arcSpan > 180 ? '1' : '0';
        const sweepFlag = '1'; // Clockwise direction
        
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
    };

    const backgroundPath = createArcPath(135, 405, radius, centerX, centerY); // 270° arc (135° to 45°)
    const currentAngleForPath = 135 + ((currentValue - min) / (max - min)) * 270;
    const valuePath = createArcPath(135, currentAngleForPath, radius, centerX, centerY);

    // Calculate handle position
    const handleX = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
    const handleY = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);

    return (
        <div 
            style={{ 
                display: 'inline-block', 
                cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab'),
                userSelect: 'none',
                opacity: disabled ? 0.6 : 1,
                transition: 'opacity 0.3s ease'
            }}
        >
            <svg
                ref={knobRef}
                width={size}
                height={size}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                style={{ 
                    outline: 'none',
                    filter: isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                    transition: 'filter 0.2s ease'
                }}
            >
                {/* Background track */}
                <path
                    d={backgroundPath}
                    stroke={rangeColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
                
                {/* Value track */}
                <path
                    d={valuePath}
                    stroke={valueColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
                
                {/* Handle */}
                <circle
                    cx={handleX}
                    cy={handleY}
                    r={strokeWidth / 2 + 2}
                    fill={valueColor}
                    stroke="white"
                    strokeWidth="2"
                    style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                        transformOrigin: `${handleX}px ${handleY}px`,
                        transition: 'transform 0.2s ease'
                    }}
                />
                
                {/* Center dot */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r="3"
                    fill={rangeColor}
                />
            </svg>
        </div>
    );
};

// LED Component
const LEDIndicator = ({ brightness = 50, color = '#ffd700', size = 60 }) => {
    const normalizedBrightness = Math.max(0, Math.min(100, brightness));
    const opacity = normalizedBrightness / 100;
    const glowIntensity = normalizedBrightness / 100;

    const ledStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: opacity > 0 ? color : '#333',
        opacity: opacity > 0 ? 0.3 + (opacity * 0.7) : 0.3,
        boxShadow: opacity > 0
            ? `0 0 ${10 * glowIntensity}px ${color}, 
               0 0 ${20 * glowIntensity}px ${color}, 
               0 0 ${30 * glowIntensity}px ${color},
               inset 0 0 ${5 * glowIntensity}px rgba(255,255,255,0.3)`
            : 'inset 0 0 5px rgba(0,0,0,0.5)',
        border: `2px solid ${opacity > 0 ? color : '#666'}`,
        transition: 'all 0.3s ease',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px'
    };

    const highlightStyle = {
        width: `${size * 0.3}px`,
        height: `${size * 0.3}px`,
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.6)',
        opacity: opacity * 0.8,
        position: 'absolute',
        top: `${size * 0.15}px`,
        left: `${size * 0.25}px`,
        transition: 'opacity 0.3s ease'
    };

    return (
        <div style={ledStyle}>
            <div style={highlightStyle}></div>
        </div>
    );
};

function Led({ initialBrightness, initialName, initialLocation, battery, uuid, initialColor = '#4ade80' }) {
    // UI state (what user sees)
    const [brightness, setBrightness] = useState(initialBrightness);
    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialLocation);
    const [batteryLevel, setBatteryLevel] = useState(battery);
    const [ledColor, setLedColor] = useState(initialColor);
    
    const { getUserId } = useUser();
    const { shouldUpdateValue, hasPendingOperations, sendCommand, getPendingValue, getDisplayValue } = usePendingState();
    const userID = getUserId();

    // Temporary state for smooth knob dragging
    const [tempBrightness, setTempBrightness] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Update state only when context allows it (no pending or values match)
    useEffect(() => {
        // Always update basic info
        setName(initialName);
        setLocation(initialLocation);
        setBatteryLevel(battery);
        
        // Update brightness only if allowed by context AND not currently dragging
        if (shouldUpdateValue(uuid, 'brightness', initialBrightness) && !isDragging) {
            setBrightness(initialBrightness);
        }
        
        // Update color only if allowed by context
        if (shouldUpdateValue(uuid, 'color', initialColor)) {
            setLedColor(initialColor);
        }
    }, [initialBrightness, initialName, initialLocation, battery, initialColor, uuid, shouldUpdateValue, isDragging]);

    const handleColorChange = (color) => {
        // DON'T update UI immediately - let context handle it
        console.log('Color change - sending command:', color);
        
        // Send command through context
        sendCommand(uuid, 'color', color, () => 
            fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: `{"type":"SET_COLOR","value":"${color}"}`,
                    uuid: uuid
                }),
            })
        );
    };

    const handleKnobChange = (e) => {
        // Allow smooth dragging by updating temporary state
        console.log('Knob onChange:', e.value);
        setTempBrightness(e.value);
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleKnobComplete = (e) => {
        // Send command when knob interaction is complete
        console.log('Knob onChangeComplete:', e.value);
        if (e.value !== null && e.value !== undefined) {
            console.log('Sending brightness command via knob:', e.value);
            sendCommand(uuid, 'brightness', e.value, () => 
                fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: `{"type":"SET_BRIGHTNESS","value":${e.value}}`,
                        uuid: uuid
                    }),
                })
            );
        }
        setTempBrightness(null);
        setIsDragging(false);
    };

    const bufferBrightnessUpdate = (value) => {
        // For button clicks, send command directly
        console.log('Button click - sending brightness command:', value);
        sendCommand(uuid, 'brightness', value, () => 
            fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: `{"type":"SET_BRIGHTNESS","value":${value}}`,
                    uuid: uuid
                }),
            })
        );
    };

    const handleIncrementBrightness = () => {
        const currentDisplayBrightness = getDisplayValue(uuid, 'brightness', brightness);
        const newValue = Math.min(currentDisplayBrightness + 1, 100);
        bufferBrightnessUpdate(newValue);
    };

    const handleDecrementBrightness = () => {
        const currentDisplayBrightness = getDisplayValue(uuid, 'brightness', brightness);
        const newValue = Math.max(currentDisplayBrightness - 1, 0);
        bufferBrightnessUpdate(newValue);
    };

    // Check for pending operations and get display values
    const pendingBrightness = getPendingValue(uuid, 'brightness');
    const pendingColor = getPendingValue(uuid, 'color');
    const hasPending = hasPendingOperations(uuid);
    
    // Use display values with proper blocking during pending states
    const finalDisplayBrightness = (() => {
        // If dragging, use temp value for smooth interaction
        if (isDragging && tempBrightness !== null) {
            return tempBrightness;
        }
        // If there's a pending brightness operation and we're not dragging, 
        // show the pending value to prevent jumps
        if (pendingBrightness !== null && !isDragging) {
            return pendingBrightness;
        }
        // Otherwise use the current brightness value
        return brightness;
    })();
    
    const displayColor = getDisplayValue(uuid, 'color', ledColor);

    return (
        <div
            className="uk-card uk-card-default uk-card-body uk-border-rounded uk-box-shadow-medium"
            style={{
                backgroundColor: "var(--soft-amber)",
                border: "2px solid var(--deep-brown)",
                borderRadius: "10px",
                color: "var(--deep-brown)",
                padding: "20px",
                margin: "10px",
                width: "500px",
                height: "223px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                // Add visual indicator for pending state
                opacity: hasPending ? 0.8 : 1,
                transition: "opacity 0.3s ease"
            }}
        >
            <CardHeader initialName={name} initialLocation={location} battery={batteryLevel} uuid={uuid} deviceType='LedControl'/>
            <hr style={{ borderColor: "var(--deep-brown)", margin: "10px 0" }} />

            {/* Knob and Brightness Control Buttons */}
            <div className="uk-flex uk-flex-center uk-flex-middle" style={{ position: 'relative' }}>
                {/* Decrement Button */}
                <Button
                    icon="pi pi-minus"
                    className="p-button-rounded p-button-outlined"
                    style={{
                        backgroundColor: 'var(--desert-sand)',
                        color: 'var(--deep-brown)',
                        fontSize: '1.5rem',
                        height: '50px',
                        width: '50px',
                        marginRight: '20px',
                        border: '2px solid var(--deep-brown)'
                    }}
                    onClick={handleDecrementBrightness}
                    disabled={pendingBrightness !== null && !isDragging} // Allow during dragging
                />

                {/* Knob Control with LED in center */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CustomKnob
                        value={finalDisplayBrightness}
                        size={100}
                        min={0}
                        max={100}
                        valueColor="var(--soft-green)"
                        rangeColor="var(--muted-olive)"
                        strokeWidth={10}
                        onChange={handleKnobChange}
                        onChangeComplete={handleKnobComplete}
                        disabled={false} // Always allow dragging for smooth UX
                    />

                    {/* LED and Percentage Display in center of knob */}
                    <div
                        style={{
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px'
                        }}
                    >
                        <LEDIndicator brightness={finalDisplayBrightness} color={displayColor} size={50} />
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: 'var(--deep-brown)',
                                textAlign: 'center',
                                marginTop: '2px'
                            }}
                        >
                            {finalDisplayBrightness}%
                        </div>
                    </div>
                </div>

                {/* Increment Button */}
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-outlined"
                    style={{
                        backgroundColor: 'var(--soft-green)',
                        color: 'var(--deep-brown)',
                        fontSize: '1.5rem',
                        height: '50px',
                        width: '50px',
                        marginLeft: '20px',
                        border: '2px solid var(--deep-brown)'
                    }}
                    onClick={handleIncrementBrightness}
                    disabled={pendingBrightness !== null && !isDragging} // Allow during dragging
                />
            </div>
        </div>
    );
}

export default Led;