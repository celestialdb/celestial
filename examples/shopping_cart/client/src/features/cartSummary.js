import React from 'react'
import {useSelector} from "react-redux";
import {cartTotal} from "../utils/selectors";

export const CartSummary = () => {
    const data =useSelector(cartTotal);

    return (
        <div>
            <h2>$ {data}</h2>
        </div>
    );
}

export default CartSummary
