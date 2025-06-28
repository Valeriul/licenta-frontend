import React, { createContext, useContext, useState, useCallback } from 'react';

const PendingStateContext = createContext();

export const usePendingState = () => {
    const context = useContext(PendingStateContext);
    if (!context) {
        throw new Error('usePendingState must be used within a PendingStateProvider');
    }
    return context;
};

export const PendingStateProvider = ({ children }) => {
    // Store pending states: { uuid: { brightness: 45, color: '#ff0000', state: true, ... } }
    const [pendingStates, setPendingStates] = useState({});

    // Set a pending value for a specific device and property
    const setPendingValue = useCallback((uuid, property, value) => {
        setPendingStates(prev => ({
            ...prev,
            [uuid]: {
                ...prev[uuid],
                [property]: value
            }
        }));
        console.log(`Setting pending ${property} for ${uuid}:`, value);
    }, []);

    // Clear a pending value when confirmed
    const clearPendingValue = useCallback((uuid, property) => {
        setPendingStates(prev => {
            const newState = { ...prev };
            if (newState[uuid]) {
                const { [property]: removed, ...rest } = newState[uuid];
                if (Object.keys(rest).length === 0) {
                    delete newState[uuid];
                } else {
                    newState[uuid] = rest;
                }
            }
            return newState;
        });
        console.log(`Clearing pending ${property} for ${uuid}`);
    }, []);

    // Get pending value for a specific device and property
    const getPendingValue = useCallback((uuid, property) => {
        return pendingStates[uuid]?.[property] ?? null;
    }, [pendingStates]);

    // Check if a device has any pending operations
    const hasPendingOperations = useCallback((uuid) => {
        return Boolean(pendingStates[uuid] && Object.keys(pendingStates[uuid]).length > 0);
    }, [pendingStates]);

    // Check if we should update a value (no pending operation or received value matches pending)
    const shouldUpdateValue = useCallback((uuid, property, incomingValue) => {
        const pendingValue = getPendingValue(uuid, property);
        const shouldUpdate = pendingValue === null || incomingValue === pendingValue;
        
        console.log(`Should update ${property} for ${uuid}? Pending: ${pendingValue}, Incoming: ${incomingValue}, Result: ${shouldUpdate}`);
        
        // If values match, clear the pending state
        if (shouldUpdate && pendingValue !== null) {
            clearPendingValue(uuid, property);
        }
        
        return shouldUpdate;
    }, [getPendingValue, clearPendingValue]);

    // Clear all pending operations for a device (useful for errors)
    const clearAllPending = useCallback((uuid) => {
        setPendingStates(prev => {
            const newState = { ...prev };
            delete newState[uuid];
            return newState;
        });
        console.log(`Clearing all pending operations for ${uuid}`);
    }, []);

    // Send command with automatic pending state management
    const sendCommand = useCallback(async (uuid, property, value, apiCall) => {
        try {
            // Set pending state
            setPendingValue(uuid, property, value);
            
            // Make API call
            const response = await apiCall();
            
            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
            }
            
            console.log(`Command sent successfully for ${uuid} ${property}:`, value);
            return true;
        } catch (error) {
            console.error(`Error sending command for ${uuid} ${property}:`, error);
            // Clear pending state on error
            clearPendingValue(uuid, property);
            return false;
        }
    }, [setPendingValue, clearPendingValue]);

    // Get the current display value (pending value if exists, otherwise current value)
    const getDisplayValue = useCallback((uuid, property, currentValue) => {
        const pendingValue = getPendingValue(uuid, property);
        return pendingValue !== null ? pendingValue : currentValue;
    }, [getPendingValue]);

    const value = {
        // State queries
        getPendingValue,
        hasPendingOperations,
        shouldUpdateValue,
        getDisplayValue, // New method for display values
        
        // State management
        setPendingValue,
        clearPendingValue,
        clearAllPending,
        
        // Convenience method for API calls
        sendCommand,
        
        // Debug - you can remove this in production
        pendingStates
    };

    return (
        <PendingStateContext.Provider value={value}>
            {children}
        </PendingStateContext.Provider>
    );
};

export default PendingStateContext;