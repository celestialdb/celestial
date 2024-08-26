import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { tasksData } from "./tasksData";
import { colorsData } from "./colorsData";
import { statusData } from "./statusData";
import cacheReducer from "./cache";
const store = configureStore({
  reducer: {
    tasks: tasksData.reducer,
    colors: colorsData.reducer,
    status: statusData.reducer,
    cache: cacheReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(statusData.middleware)
      .concat(colorsData.middleware)
      .concat(tasksData.middleware),
});
setupListeners(store.dispatch);
export default store;
