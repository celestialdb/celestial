import { createEntityAdapter, Dictionary, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState();
export const colorsData = createApi({
  reducerPath: "colors",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001" }),
  tagTypes: ["Colors"],
  endpoints: (build) => ({
    getColors: build.query<EntityState<any>, GetColorsApiArg>({
      query: () => ({ url: `/colors` }),
      providesTags: ["Colors"],
      transformResponse: (responseData: GetColorsApiResponse) =>
        entityAdapter.setAll(initialState, responseData),
    }),
  }),
});
const selectEntryResult = (state: any) =>
  colorsData.endpoints.getColors.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectColors = entrySelectors.selectAll;
export const selectColorsIds = entrySelectors.selectIds;
export const selectColorsById = entrySelectors.selectById;
export type GetColorsApiResponse = /** status 200 A list of colors */ Color[];
export type GetColorsApiArg = void;
export type Color = {
  id?: number;
  color?: string;
};
export const { useGetColorsQuery } = colorsData;
