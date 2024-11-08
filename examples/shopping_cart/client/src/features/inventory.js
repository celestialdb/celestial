import React from 'react'

export const Inventory = () => {
    const data = [
        {id: 1, name:"apple", price:2},
        {id: 2, name:"milk", price:5},
        {id: 3, name:"eggs", price:3},
        {id: 4, name:"bread", price:3},
        {id: 5, name:"butter", price:8}]



    return (
        <div>
            {data.map(item => (
                <div key={item.id} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                    <span style={{marginRight: '10px'}}>{item.name} - ${item.price}</span>
                    <button style={{marginRight: '5px'}}>Add</button>
                    <button>Remove</button>
                    <span className="circle">x</span>
                </div>
            ))}
        </div>
    );
}

export default Inventory
