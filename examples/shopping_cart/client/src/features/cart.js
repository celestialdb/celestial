import React from 'react'
import {useSelector} from "react-redux";
import {cartItemsDetails} from "../utils/selectors";
import {capitalize} from "../utils/utils";

const CartItem = ({item})=> {

    return (
        <div key={item.id} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
            <span style={{marginRight: '10px'}}>{capitalize(item.name)}</span>
            <span className="circle">{item.quantity}</span>
            <span className="circle">${item.price * item.quantity}</span>
        </div>
    )

}

export const Cart = () => {
    const data = [] // useSelector(cartItemsDetails) || []

    if (data.length===0) {
        return ( <div>Cart is empty</div>)
    }

    return (
        <div>
            {data.map(item => (
                CartItem({item})
            ))}
        </div>
    );
}

export default Cart
