import React from "react";
import { useDrag, useDrop } from "react-dnd";
import CardFactory from "../CardFactory/CardFactory";

const ItemType = "CARD";

function DraggableCard({ peripheral, moveCard }) {
    const [, ref] = useDrag({
        type: ItemType,
        item: { uuid: peripheral.uuid_Peripheral },
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover(item) {
            if (item.uuid !== peripheral.uuid_Peripheral) {
                moveCard(item.uuid, peripheral.uuid_Peripheral);
            }
        },
    });

    const cardRef = (node) => {
        ref(node);
        drop(node);
    };

    return (
        <div ref={cardRef} style={{ padding: "10px" }}>
            {CardFactory(peripheral)}
        </div>
    );
}

export default DraggableCard;
