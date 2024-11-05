import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState({
  ids: [],
  entities: {},
});
export const issueAssigneesData = createApi({
  reducerPath: "issueAssignees",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["issueAssignees"],
  endpoints: (build) => ({
    getIssueAssignees: build.query<EntityState<any>, GetIssueAssigneesApiArg>({
      query: () => ({ url: `/issueAssignees` }),
      providesTags: ["issueAssignees"],
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
export type GetIssueAssigneesApiResponse =
  /** status 200 Successful response */ {
    issueAssignees?: {
      id?: number;
      users?: {
        id?: number;
      }[];
      userIds?: number;
    }[];
  };
export type GetIssueAssigneesApiArg = void;
export const { useGetIssueAssigneesQuery } = issueAssigneesData;
