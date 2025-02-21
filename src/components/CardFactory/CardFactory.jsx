import React from "react";
import TemperatureHumidityCard from "../TemperatureHumidityCard/TemperatureHumidityCard";
import TemperatureControlCard from "../TemperatureControlCard/TemperatureControlCard";
import Led from "../Led/Led";

function CardFactory(peripheral) {

    var peripheral_data = JSON.parse(peripheral.data);

    switch (peripheral.type) {
        case "TemperatureHumiditySensor":
            return (
                <TemperatureHumidityCard
                    key={peripheral.uuid_Peripheral}
                    temperature={peripheral_data?.temperature || "N/A"}
                    humidity={peripheral_data?.humidity || "N/A"}
                    battery={peripheral_data?.batteryLevel || "N/A"}
                    uuid={peripheral.uuid_Peripheral}
                    initialName={peripheral.name}
                    initialLocation={peripheral.location}
                />
            );

        case "TemperatureControl":
            return (
                <TemperatureControlCard
                    key={peripheral.uuid_Peripheral}
                    initialTemperature={peripheral_data?.temperature || "N/A"}
                    initialName={peripheral.name}
                    uuid={peripheral.uuid_Peripheral}
                    initialLocation={peripheral.location}
                    battery={peripheral_data?.batteryLevel || "N/A"}
                />
            );
        case  "LedControl":
            console.log(peripheral);
            return (
                <Led
                    key={peripheral.uuid_Peripheral}
                    initialName={peripheral.name}
                    uuid={peripheral.uuid_Peripheral}
                    initialLocation={peripheral.location}
                    battery={peripheral_data?.batteryLevel || 0}
                    initialBrightness={peripheral_data?.brightness || 0}
                />
            )

        default:
            return null;
    }
}

export default CardFactory;
