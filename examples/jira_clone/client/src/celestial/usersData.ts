import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState();
export const usersData = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Users"],
  endpoints: (build) => ({
    getCurrentUser: build.query<EntityState<any>, GetCurrentUserApiArg>({
      query: () => ({ url: `/currentUser` }),
      providesTags: ["Users"],
      transformResponse: (responseData: GetCurrentUserApiResponse) =>
        entityAdapter.setAll(initialState, responseData),
    }),
  }),
});
const selectEntryResult = (state: any) =>
  usersData.endpoints.getCurrentUser.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectUsers = entrySelectors.selectAll;
export const selectUsersIds = entrySelectors.selectIds;
export const selectUsersById = entrySelectors.selectById;
export type GetCurrentUserApiResponse =
  /** status 200 Successful response */ User;
export type GetCurrentUserApiArg = void;
export type User = {
  id?: number;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  projectId?: number;
};
export const { useGetCurrentUserQuery } = usersData;
