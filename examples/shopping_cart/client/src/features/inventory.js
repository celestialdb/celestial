import React from 'react'
import {
    selectInventory,
    usePutCartActionMutation
} from "../celestial";
import {capitalize} from "../utils/utils";
import {useSelector} from "react-redux";

export const Inventory = () => {
    const [modifyCart] = usePutCartActionMutation();

    const data = useSelector(selectInventory) || [];

    const addToCart = (item) => {
        modifyCart({action: 'add', body: {item_id: item.id}})
    }

    const removeFromCart = (item) => {
          modifyCart({action: 'remove', body: {item_id: item.id}})
    }

    return (
        <div>
            {data.map(item => (
                <div key={item.id} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                    <span style={{marginRight: '10px', fontWeight: 'bold'}}>{capitalize(item.name)} - ${item.price}</span>
                    <button style={{marginRight: '5px'}} onClick={() => addToCart(item)}>Add</button>
                    <button onClick={() => removeFromCart(item)}>Remove</button>
                </div>
            ))}
        </div>
    );
}

export default Inventory
