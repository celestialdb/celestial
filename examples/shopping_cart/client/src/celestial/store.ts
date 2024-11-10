import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { inventoryData } from "./inventoryData";
import { cartData } from "./cartData";
import cacheReducer from "./cache";
const store = configureStore({
  reducer: {
    inventory: inventoryData.reducer,
    cart: cartData.reducer,
    cache: cacheReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(cartData.middleware)
      .concat(inventoryData.middleware),
});
setupListeners(store.dispatch);
export default store;
