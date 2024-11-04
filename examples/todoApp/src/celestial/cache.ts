import {createSlice} from "@reduxjs/toolkit";
import {useEffect} from 'react';
import {useDispatch} from "react-redux";

const initialState = {};
const cache = createSlice({
  name: "cache",
  initialState: initialState,
  reducers: {
    updateCache: {
      reducer(state, action) {
        const { key, value } = action.payload;
        //@ts-ignore
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
const { updateCache } = cache.actions;
export default cache.reducer;
export const selectCache = (state: any) => state.cache;

export function useCacheInit(key:string, value:any) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateCache(key, value));
  }, []);
}

export function useCacheUpdate() {
  const dispatch = useDispatch();

  return (key: string, value: any) => {
    dispatch(updateCache(key, value));
  };
}

