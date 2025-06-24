import React, { useState, useRef, useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Knob } from 'primereact/knob';
import { Button } from 'primereact/button';
import { useUser } from '../../contexts/UserContext';
import CardHeader from "../CardHeader/CardHeader";

// Compact Realistic Light Switch Component
const CompactLightSwitch = ({ isOn, onToggle }) => {
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
          cursor: 'pointer'
        }}
        onClick={onToggle}
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

function Relay({ initialIsOn, initialName, initialLocation, battery, uuid }) {
    const [isOn, setIsOn] = useState(initialIsOn);
    const [name, setName] = useState(initialName);
    const [location, setLocation] = useState(initialLocation);
    const [batteryLevel, setBatteryLevel] = useState(battery);

    const { getUserId } = useUser();
    const userID = getUserId();

    const bufferRef = useRef([]);
    const timeoutRef = useRef(null);

    // Fix: Remove isOn from dependency array to prevent infinite re-renders
    useEffect(() => {
        setIsOn(initialIsOn);
        setName(initialName);
        setLocation(initialLocation);
        setBatteryLevel(battery);
    }, [initialIsOn, initialName, initialLocation, battery]);

    const setOn = () => {
        fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: `{"type":"SET_ON"}`,
                uuid: uuid
            }),
        }).then((response) => {
            if (response.ok) {
                console.log("Relay set successfully: ON");
                setIsOn(true);
            } else {
                console.error("Failed to set relay:", response.statusText);
            }
        }).catch((error) => {
            console.error("Error setting relay:", error);
        });
    };

    const setOff = () => {
        fetch(`${process.env.REACT_APP_API_URL}/Peripheral/makeControlCommand?id_user=${userID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: `{"type":"SET_OFF"}`,
                uuid: uuid
            }),
        }).then((response) => {
            if (response.ok) {
                console.log("Relay set successfully: OFF");
                setIsOn(false);
            } else {
                console.error("Failed to set relay:", response.statusText);
            }
        }).catch((error) => {
            console.error("Error setting relay:", error);
        });
    };

    const handleToggle = () => {
        if (isOn) {
            setOff();
        } else {
            setOn();
        }
    };

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
            }}
        >
            <CardHeader initialName={name} initialLocation={location} battery={batteryLevel} uuid={uuid} deviceType='Relay'/>
            <hr style={{ borderColor: "var(--deep-brown)", margin: "10px 0" }} />

            {/* Compact Light Switch */}
            <div className="uk-flex uk-flex-center uk-flex-middle" style={{ position: 'relative' }}>
                <CompactLightSwitch isOn={isOn} onToggle={handleToggle} />
            </div>
        </div>
    );
}

export default Relay;