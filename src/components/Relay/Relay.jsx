import React, { useState, useRef, useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Knob } from 'primereact/knob';
import { Button } from 'primereact/button';
import { useUser } from '../../contexts/UserContext';
import { usePendingState } from '../../contexts/PendingStateContext';
import CardHeader from "../CardHeader/CardHeader";

// Compact Realistic Light Switch Component
const CompactLightSwitch = ({ isOn, onToggle, isPending = false }) => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Wall plate */}
      <div 
        style={{ 
          backgroundColor: 'white',
          borderRadius: '6px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '12px',
          border: '1px solid #e5e7eb',
          width: '70px',
          height: '112px',
          cursor: isPending ? 'wait' : 'pointer',
          opacity: isPending ? 0.7 : 1,
          transition: 'opacity 0.3s ease'
        }}
        onClick={!isPending ? onToggle : undefined}
      >
        {/* Switch housing */}
        <div 
          style={{
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '45px',
            height: '70px'
          }}
        >
          {/* Switch track */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '4px',
              transition: 'all 0.3s',
              backgroundColor: !isOn ? '#4ade80' : '#f87171',
              boxShadow: !isOn 
                ? 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(34, 197, 94, 0.3)'
                : 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(239, 68, 68, 0.3)'
            }}
          >
            {/* Switch paddle */}
            <div 
              style={{
                position: 'absolute',
                left: '3px',
                right: '3px',
                height: '30px',
                backgroundColor: 'white',
                borderRadius: '3px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease-out',
                top: !isOn ? '3px' : 'auto',
                bottom: !isOn ? 'auto' : '3px'
              }}
            >
              {/* Switch paddle highlight */}
              <div 
                style={{
                  position: 'absolute',
                  left: '4px',
                  right: '4px',
                  top: '2px',
                  height: '4px',
                  background: 'linear-gradient(to bottom, white, transparent)',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  opacity: 0.6
                }}
              ></div>
            </div>
          </div>
          
          {/* Screws */}
          <div 
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '4px',
              backgroundColor: '#d1d5db',
              borderRadius: '50%'
            }}
          ></div>
          <div 
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '4px',
              backgroundColor: '#d1d5db',
              borderRadius: '50%'
            }}
          ></div>
        </div>
        
        {/* Status indicator */}
        <div style={{ marginTop: '6px', textAlign: 'center' }}>
          <div 
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              transition: 'all 0.3s',
              backgroundColor: !isOn ? '#22c55e' : '#ef4444',
              boxShadow: !isOn ? '0 0 6px rgba(34, 197, 94, 0.5)' : '0 0 6px rgba(239, 68, 68, 0.5)'
            }}
          ></div>
        </div>
      </div>
      
      {/* Wall shadow */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#1f2937',
          borderRadius: '6px',
          transform: 'translate(2px, 2px)',
          zIndex: -1,
          opacity: 0.2
        }}
      ></div>
    </div>
  );
};

function Relay({ initialState, initialName, initialLocation, battery, uuid }) {
    // UI state (what user sees)
    const [isOn, setIsOn] = useState(initialState);
    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialLocation);
    const [batteryLevel, setBatteryLevel] = useState(battery);
    
    const { getUserId } = useUser();
    const { shouldUpdateValue, hasPendingOperations, sendCommand, getPendingValue, getDisplayValue } = usePendingState();
    const userID = getUserId();

    // Update state only when context allows it (no pending or values match)
    useEffect(() => {
        // Always update basic info
        setName(initialName);
        setLocation(initialLocation);
        setBatteryLevel(battery);
        
        // Update relay state only if allowed by context
        if (shouldUpdateValue(uuid, 'state', initialState)) {
            setIsOn(initialState);
        }
    }, [initialState, initialName, initialLocation, battery, uuid, shouldUpdateValue]);

    const sendRelayCommand = (command, targetState) => {
        // DON'T update UI immediately - let context handle it
        console.log('Relay command - sending:', command, 'target state:', targetState);
        
        // Send command through context - UI will update when backend confirms
        sendCommand(uuid, 'state', targetState, () => 
            fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: `{"type":"${command}"}`,
                    uuid: uuid
                }),
            })
        );
    };

    const setOn = () => {
        sendRelayCommand("SET_ON", true);
    };

    const setOff = () => {
        sendRelayCommand("SET_OFF", false);
    };

    const handleToggle = () => {
        const pendingState = getPendingValue(uuid, 'state');
        
        if (pendingState !== null) {
            return; // Don't allow toggle during pending state
        }
        
        const currentDisplayState = getDisplayValue(uuid, 'state', isOn);
        
        if (currentDisplayState) {
            setOff();
        } else {
            setOn();
        }
    };

    // Check for pending operations and get display values
    const pendingState = getPendingValue(uuid, 'state');
    const hasPending = hasPendingOperations(uuid);
    
    // Use display value (shows pending value if exists, otherwise current value)
    const displayState = getDisplayValue(uuid, 'state', isOn);

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
            <CardHeader initialName={name} initialLocation={location} battery={batteryLevel} uuid={uuid} deviceType='Relay'/>
            <hr style={{ borderColor: "var(--deep-brown)", margin: "10px 0" }} />

            {/* Compact Light Switch */}
            <div className="uk-flex uk-flex-center uk-flex-middle" style={{ position: 'relative' }}>
                <CompactLightSwitch 
                    isOn={displayState} 
                    onToggle={handleToggle} 
                    isPending={pendingState !== null}
                />
            </div>
        </div>
    );
}

export default Relay;