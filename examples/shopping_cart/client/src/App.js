import React from 'react'
import Cart from './features/cart'
import Inventory from "./features/inventory";
import CartSummary from "./features/cartSummary";


function App() {

  return (
    <div className="App">
      <nav>
        <section>

        </section>
      </nav>
        <main>
            <div><h1>Shopper's Stop</h1></div>
            <div className="container">
                <div className="left">
                    <h1>Inventory</h1>
                    <Inventory />

                </div>

                <div className="right">
                    <div className="right-top">
                        <h1>Cart Summary</h1>
                        <CartSummary />
                    </div>

                    <div className="right-bottom">

                        <h1>Cart</h1>
                        <Cart />
                    </div>


                </div>
            </div>

        </main>
    </div>
  )
}

export default App
