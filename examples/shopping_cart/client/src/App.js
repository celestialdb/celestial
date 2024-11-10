import React from 'react'
import Cart from './features/cart'
import Inventory from "./features/inventory";
import CartSummary from "./features/cartSummary";
import {useSelector} from "react-redux";
import {useGetCartItemsQuery, useGetInventoryQuery} from "./celestial";


function App() {

    console.log(useSelector((state) => state))
    const {cartIsLoading} = useGetCartItemsQuery()
    const {inventoryIsLoading} =  useGetInventoryQuery()

    if (cartIsLoading || inventoryIsLoading) {
        return <div>Loading...</div>
    }

  return (
    <div className="App">
      <nav>
        <section>

        </section>
      </nav>
        <main>
            <div style={{ textAlign: 'center' }}><h1>Shopper's Stop</h1></div>
            <div className="container">
                <div className="left">
                    <h2>Inventory</h2>
                    <Inventory />

                </div>

                <div className="right">
                    <div className="right-top">
                        <h2>Cart Summary</h2>
                        <CartSummary />
                    </div>

                    <div className="right-bottom">

                        <h2>Cart</h2>
                        <Cart />
                    </div>


                </div>
            </div>

        </main>
    </div>
  )
}

export default App
