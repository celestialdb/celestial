import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState();
export const statusData = createApi({
  reducerPath: "status",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001" }),
  tagTypes: ["Status"],
  endpoints: (build) => ({
    getStatus: build.query<EntityState<any>, GetStatusApiArg>({
      query: () => ({ url: `/status` }),
      providesTags: ["Status"],
      transformResponse: (responseData: GetStatusApiResponse) =>
        entityAdapter.setAll(initialState, responseData),
    }),
  }),
});
const selectEntryResult = (state: any) =>
  statusData.endpoints.getStatus.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectStatus = entrySelectors.selectAll;
export const selectStatusIds = entrySelectors.selectIds;
export const selectStatusById = entrySelectors.selectById;
export type GetStatusApiResponse =
  /** status 200 A list of statuses */ Status[];
export type GetStatusApiArg = void;
export type Status = {
  id?: number;
  status?: string;
};
export const { useGetStatusQuery } = statusData;
