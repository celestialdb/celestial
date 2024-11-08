import React from 'react'

export const Cart = () => {
    const data = [
        {id: 1, name:"apple", price:2},
        {id: 2, name:"milk", price:5}]



    return (
        <div>
            {data.map(item => (
                <div key={item.id} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                    <span style={{marginRight: '10px'}}>{item.name}</span>
                    <span className="circle">1</span>
                    <span className="circle">{item.price * 1}</span>
                </div>
            ))}
        </div>
    );
}

export default Cart
