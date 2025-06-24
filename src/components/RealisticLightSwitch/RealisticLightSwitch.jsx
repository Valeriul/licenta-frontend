import React, { useState } from 'react';

const RealisticLightSwitch = () => {
  const [isOn, setIsOn] = useState(false);
  
  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Wall plate */}
      <div 
        style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '24px',
          border: '1px solid #e5e7eb',
          width: '120px',
          height: '180px'
        }}
      >
        {/* Switch housing */}
        <div 
          style={{
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '70px',
            height: '120px'
          }}
          onClick={toggleSwitch}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
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
              borderRadius: '8px',
              transition: 'all 0.3s',
              backgroundColor: isOn ? '#4ade80' : '#f87171',
              boxShadow: isOn 
                ? 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(34, 197, 94, 0.3)'
                : 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(239, 68, 68, 0.3)'
            }}
          >
            {/* Switch paddle */}
            <div 
              style={{
                position: 'absolute',
                left: '4px',
                right: '4px',
                height: '56px',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-out',
                top: isOn ? '4px' : 'auto',
                bottom: isOn ? 'auto' : '4px'
              }}
            >
              {/* Switch paddle highlight */}
              <div 
                style={{
                  position: 'absolute',
                  left: '8px',
                  right: '8px',
                  top: '4px',
                  height: '8px',
                  background: 'linear-gradient(to bottom, white, transparent)',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                  opacity: 0.6
                }}
              ></div>
              
              {/* Switch paddle pressed effect */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '4px',
                  backgroundColor: '#f9fafb',
                  opacity: 0.3
                }}
              ></div>
            </div>
          </div>
          
          {/* Screws */}
          <div 
            style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '8px',
              backgroundColor: '#d1d5db',
              borderRadius: '50%',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
            }}
          ></div>
          <div 
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '8px',
              backgroundColor: '#d1d5db',
              borderRadius: '50%',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
            }}
          ></div>
        </div>
        
        {/* Status indicator */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <div 
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              transition: 'all 0.3s',
              backgroundColor: isOn ? '#22c55e' : '#ef4444',
              boxShadow: isOn ? '0 0 10px rgba(34, 197, 94, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)'
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
          borderRadius: '8px',
          transform: 'translate(4px, 4px)',
          zIndex: -1,
          opacity: 0.2
        }}
      ></div>
    </div>
  );
};

export default RealisticLightSwitch;