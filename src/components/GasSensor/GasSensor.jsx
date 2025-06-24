import React, { useState, useRef, useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { useUser } from '../../contexts/UserContext';
import CardHeader from "../CardHeader/CardHeader";

// Alert Light Component
const AlertLight = ({ isOn, size = 100 }) => {
  const lightColor = isOn ? '#dc4444' : '#8b5152';

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 300 300"
          className="drop-shadow-lg"
        >
          {/* Bottom base - darkest */}
          <rect
            x="75"
            y="260"
            width="150"
            height="25"
            fill="#666"
            rx="4"
          />

          {/* Middle base - medium gray */}
          <rect
            x="90"
            y="240"
            width="120"
            height="30"
            fill="#888"
            rx="6"
          />

          {/* Main Alert Body - dome shape */}
          <path
            d="M 105 240 L 105 140 Q 105 90 150 90 Q 195 90 195 140 L 195 240 Z"
            fill={lightColor}
          />

          {/* Inner highlight circle */}
          <circle
            cx="150"
            cy="150"
            r="25"
            fill="rgba(255,255,255,0.4)"
          />

          {/* Center post/stem */}
          <rect
            x="147"
            y="150"
            width="6"
            height="50"
            fill="rgba(255,255,255,0.3)"
            rx="3"
          />

          {/* Glowing effect - only when light is on */}
          {isOn && (
            <>
              {/* Outer glow */}
              <circle
                cx="150"
                cy="150"
                r="60"
                fill="none"
                stroke={lightColor}
                strokeWidth="8"
                opacity="0.3"
                filter="blur(8px)"
              />

              {/* Medium glow */}
              <circle
                cx="150"
                cy="150"
                r="45"
                fill="none"
                stroke={lightColor}
                strokeWidth="6"
                opacity="0.4"
                filter="blur(4px)"
              />

              {/* Inner glow */}
              <circle
                cx="150"
                cy="150"
                r="35"
                fill="none"
                stroke={lightColor}
                strokeWidth="4"
                opacity="0.5"
                filter="blur(2px)"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

function GasSensor({ initialGasValue, initialName, initialLocation, battery, uuid }) {
  const [gasValue, setGasValue] = useState(initialGasValue);
  const [name, setName] = useState(initialName);
  const [location, setLocation] = useState(initialLocation);
  const [batteryLevel, setBatteryLevel] = useState(battery);

  const { getUserId } = useUser();
  const userID = getUserId();

  // Determine if alert should be on based on gas value
  const isAlertOn = gasValue > 1200;

  useEffect(() => {
    setGasValue(initialGasValue);
    setName(initialName);
    setLocation(initialLocation);
    setBatteryLevel(battery);
  }, [initialGasValue, initialName, initialLocation, battery]);

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
      <CardHeader initialName={name} initialLocation={location} battery={batteryLevel} uuid={uuid} deviceType="GasSensor" />
      <hr style={{ borderColor: "var(--deep-brown)", margin: "10px 0" }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <AlertLight isOn={isAlertOn} size={100} />
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: isAlertOn ? '#dc4444' : 'var(--deep-brown)'
        }}>
        </div>
        {isAlertOn && (
          <div style={{
            fontSize: '14px',
            color: '#dc4444',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
          </div>
        )}
      </div>
    </div>
  );
}

export default GasSensor;