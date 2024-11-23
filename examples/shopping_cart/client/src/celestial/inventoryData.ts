import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState({
  ids: [],
  entities: {},
});
export const inventoryData = createApi({
  reducerPath: "inventory",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001" }),
  tagTypes: ["inventory"],
  endpoints: (build) => ({
    getInventory: build.query<EntityState<any>, GetInventoryApiArg>({
      query: () => ({ url: `/inventory` }),
      providesTags: ["inventory"],
      transformResponse: (responseData: GetInventoryApiResponse) =>
        entityAdapter.setAll(initialState, responseData),
    }),
  }),
});
const selectEntryResult = (state: any) =>
  inventoryData.endpoints.getInventory.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectInventory = entrySelectors.selectAll;
export const selectInventoryIds = entrySelectors.selectIds;
export const selectInventoryById = entrySelectors.selectById;
export type GetInventoryApiResponse =
  /** status 200 List of inventory items */ Inventory[];
export type GetInventoryApiArg = void;
export type Inventory = {
  id?: number;
  name?: string;
  price?: number;
};
export type Error = {
  error?: string;
};
export const { useGetInventoryQuery } = inventoryData;
