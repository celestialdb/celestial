import { createSlice } from "@reduxjs/toolkit";
const initialState = {};
const cache = createSlice({
  name: "cache",
  initialState: initialState,
  reducers: {
    updateCache: {
      reducer(state, action) {
        const { key, value } = action.payload;
        state[key] = value;
      },
      prepare(key, value) {
        return {
          payload: { key, value },
          meta: undefined,
          error: undefined,
        };
      },
    },
  },
});
export const { updateCache } = cache.actions;
export default cache.reducer;
export const selectCache = (state) => state.cache;
