import {createSelector} from "reselect";
import {selectCart, selectInventory} from "../celestial";

export const cartItemsDetails = createSelector(
    selectCart,
    selectInventory,
    (cart, inventory) => {
        if (cart.length === 0 || inventory.length === 0) {
            return []
        }

        return cart.map(item => {
            const itemDetails = inventory.find(i => i.id === item.item_id)
            return {...item, ...itemDetails}
        })
    }
)

export const cartTotal = createSelector(
    cartItemsDetails,
    (cartItems) => {
        if (cartItems.length === 0) {
            return 0
        }
        return cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
    }
)