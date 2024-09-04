import { createEntityAdapter, Dictionary, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState({ids:[], entities:{}});
export const issueAssigneesData = createApi({
    reducerPath: "issueAssignees",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
    tagTypes: ["IssueAssignees"],
    endpoints: (build) => ({
        getIssueAssignees: build.query<EntityState<any>, GetIssuesApiArg>({
            query: () => ({ url: `/issueAssignees`,
                headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImlhdCI6MTcyNTAzNzQ5NywiZXhwIjoxNzQwNTg5NDk3fQ.uj8Edcda52PVczeJn0KLXDu-XjzKMFMWJ2rH1uBThE4'} }),
            providesTags: ["IssueAssignees"],
            transformResponse: (responseData: GetIssueAssigneesApiResponse) =>
                entityAdapter.setAll(initialState, responseData.issueAssignees),
        }),
    }),
});
const selectEntryResult = (state: any) =>
    issueAssigneesData.endpoints.getIssueAssignees.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
    (state) => selectEntryResult(state) ?? initialState,
);
export const selectIssueAssignees = entrySelectors.selectAll;
export const selectIssueAssigneesIds = entrySelectors.selectIds;
export const selectIssueAssigneesById = entrySelectors.selectById;
export type GetIssueAssigneesApiResponse = {issueAssignees: IssueAssignee[]};
export type GetIssuesApiArg = void;
export type IssueAssignee = {
    id?: number;
    users?: User[];
    userIds?: number[];
};
export type User = {
    id: number;
}
export const {
    useGetIssueAssigneesQuery,
} = issueAssigneesData;
