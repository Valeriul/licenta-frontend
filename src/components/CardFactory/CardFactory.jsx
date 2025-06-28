import React from "react";
import Led from "../Led/Led";
import GasSensor from "../GasSensor/GasSensor";
import TemperatureSensor from "../TemperatureSensor/TemperatureSensor";
import Relay from "../Relay/Relay";

function CardFactory(peripheral) {
    var peripheral_data = JSON.parse(peripheral.data);
    if(peripheral_data === null)
        return null;

    // Common props for all components
    const commonProps = {
        key: peripheral.uuid_Peripheral,
        initialName: peripheral.name,
        uuid: peripheral.uuid_Peripheral,
        initialLocation: peripheral.location,
        battery: peripheral_data.batteryLevel || 0,
        deviceType: peripheral.type, // Pass the device type
        additionalData: peripheral_data // Pass all peripheral data
    };

    switch (peripheral.type) {
        case "LedControl":
            return (
                <Led
                    {...commonProps}
                    initialBrightness={peripheral_data.brightness || 0}
                    initialColor={peripheral_data.color || '#4ade80'}
                />
            );
        case "GasSensor":
            return (
                <GasSensor
                    {...commonProps}
                    initialGasValue={peripheral_data.gasValue || 0}
                />
            );
        case "TemperatureSensor":
            return (
                <TemperatureSensor
                    {...commonProps}
                    initialTemperature={peripheral_data.temperatureC || 0}
                />
            );
        case "Relay":
            return (
                <Relay
                    {...commonProps}
                    initialState={peripheral_data.isOn || false} // Fixed: use initialState instead of initialIsOn
                />
            );
        default:
            return null;
    }
}

export default CardFactory;