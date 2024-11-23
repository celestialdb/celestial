import React from 'react'
import {
    selectCart, selectCartById,
    selectInventory,
    usePutCartAddMutation, usePutCartRemoveMutation
} from "../celestial";
import {capitalize} from "../utils/utils";
import {useSelector} from "react-redux";

export const Inventory = () => {
    const [addToCart] = usePutCartAddMutation();
    const [removeFromCart] = usePutCartRemoveMutation();

    const data = useSelector(selectInventory) || [];

    const cartItems = useSelector(selectCart) || [];

    const addToCartFunc = (item) => {
        let q = 0;
       const cart = cartItems[item.id]
           if (cart !== undefined) {
               q = cart['quantity']
           }
        addToCart({itemId: item.id, body: {quantity:q+1}})
    }

    const removeFromCartFunc = (item) => {
        let q = 0;
        const cart = cartItems[item.id]
        if (cart !== undefined) {
            q = cart['quantity']
        } else {
            return;
        }
          removeFromCart({itemId: item.id, body: {quantity: q-1}})
    }

    return (
        <div>
            {data.map(item => (
                <div key={item.id} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                    <span style={{marginRight: '10px', fontWeight: 'bold'}}>{capitalize(item.name)} - ${item.price}</span>
                    <button style={{marginRight: '5px'}} onClick={() => addToCartFunc(item)}>Add</button>
                    <button onClick={() => removeFromCartFunc(item)}>Remove</button>
                </div>
            ))}
        </div>
    );
}

export default Inventory
