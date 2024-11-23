import {createSelector} from "reselect";
import {selectCart, selectInventory} from "../celestial";

// selector to add item details to cart items
export const selectCartItemsDetails = createSelector(
    selectCart,
    selectInventory,
    (cart, inventory) => {
        if (cart.length === 0 || inventory.length === 0) {
            return []
        }

        return cart.map(item => {
            const itemDetails = inventory.find(i => i.id === item.id)
            return {...item, ...itemDetails}
        })
    }
)

// selector to calculate the total price of the cart
export const cartTotal = createSelector(
    selectCartItemsDetails,
    (cartItems) => {
        if (cartItems.length === 0) {
            return 0
        }
        return cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
    }
)