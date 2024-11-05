import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState({
  ids: [],
  entities: {},
});
export const usersData = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["users"],
  endpoints: (build) => ({
    getUsers: build.query<EntityState<any>, GetUsersApiArg>({
      query: () => ({ url: `/users` }),
      providesTags: ["users"],
      transformResponse: (responseData: GetUsersApiResponse) =>
        entityAdapter.setAll(initialState, responseData.users),
    }),
  }),
});
const selectEntryResult = (state: any) =>
  usersData.endpoints.getUsers.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectUsers = entrySelectors.selectAll;
export const selectUsersIds = entrySelectors.selectIds;
export const selectUsersById = entrySelectors.selectById;
export type GetUsersApiResponse = /** status 200 Successful response */ {
  users?: User[];
};
export type GetUsersApiArg = void;
export type User = {
  id?: number;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  projectId?: number;
};
export const { useGetUsersQuery } = usersData;
