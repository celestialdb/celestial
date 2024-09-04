import { createEntityAdapter, Dictionary, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState();
export const currentUserData = createApi({
    reducerPath: "currentUser",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
    tagTypes: ["currentUser"],
    endpoints: (build) => ({
        getCurrentUser: build.query<EntityState<any>, GetCurrentUserApiArg>({
            query: () => ({ url: `/currentUser`, headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImlhdCI6MTcyNTAzNzQ5NywiZXhwIjoxNzQwNTg5NDk3fQ.uj8Edcda52PVczeJn0KLXDu-XjzKMFMWJ2rH1uBThE4'} }),
            providesTags: ["currentUser"],
            transformResponse: (responseData: GetCurrentUserApiResponse) =>
                entityAdapter.setAll(initialState, responseData),
        }),
    }),
});
const selectEntryResult = (state: any) =>
    currentUserData.endpoints.getCurrentUser.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
    (state) => selectEntryResult(state) ?? initialState,
);
export const selectCurrentUser = entrySelectors.selectAll;
export const selectCurrentUserIds = entrySelectors.selectIds;
export const selectCurrentUserById = entrySelectors.selectById;
export type GetCurrentUserApiResponse =
/** status 200 Successful response */ currentUser;
export type GetCurrentUserApiArg = void;
export type currentUser = {
    id?: number;
    name?: string;
    email?: string;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    projectId?: number;
};
export const { useGetCurrentUserQuery } = currentUserData;
