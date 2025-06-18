import React from "react";
import Led from "../Led/Led";
import GasSensor from "../GasSensor/GasSensor";

function CardFactory(peripheral) {

    var peripheral_data = JSON.parse(peripheral.data);
    if(peripheral_data === null)
        return null;

    switch (peripheral.type) {
        case  "LedControl":
           
            return (
                <Led
                    key={peripheral.uuid_Peripheral}
                    initialName={peripheral.name}
                    uuid={peripheral.uuid_Peripheral}
                    initialLocation={peripheral.location}
                    battery={peripheral_data.batteryLevel || 0}
                    initialBrightness={peripheral_data.brightness || 0}
                />
            )
        case "GasSensor":
            return (
                <GasSensor
                    key={peripheral.uuid_Peripheral}
                    initialName={peripheral.name}
                    uuid={peripheral.uuid_Peripheral}
                    initialLocation={peripheral.location}
                    battery={peripheral_data.batteryLevel || 0}
                    initialGasValue={peripheral_data.gasValue || 0}
                />
            );
        case "TemperatureSensor":
            return (
                <TemperatureSensor
                    key={peripheral.uuid_Peripheral}
                    initialName={peripheral.name}
                    uuid={peripheral.uuid_Peripheral}
                    initialLocation={peripheral.location}
                    battery={peripheral_data.batteryLevel || 0}
                    initialTemperature={peripheral_data.temperature || 0}
                />
            );
        case "Relay":
            return (
                <Relay
                    key={peripheral.uuid_Peripheral}
                    initialName={peripheral.name}
                    uuid={peripheral.uuid_Peripheral}
                    initialLocation={peripheral.location}
                    battery={peripheral_data.batteryLevel || 0}
                    initialState={peripheral_data.state || false}
                />
            );
        default:
            return null;
    }
}

export default CardFactory;
