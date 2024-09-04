import { createEntityAdapter, Dictionary, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState({ids:[], entities:{}});
export const issuesData = createApi({
  reducerPath: "issues",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Issues"],
  endpoints: (build) => ({
    getIssues: build.query<EntityState<any>, GetIssuesApiArg>({
      query: () => ({ url: `/issues`,
        headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImlhdCI6MTcyNTAzNzQ5NywiZXhwIjoxNzQwNTg5NDk3fQ.uj8Edcda52PVczeJn0KLXDu-XjzKMFMWJ2rH1uBThE4'} }),
      providesTags: ["Issues"],
      transformResponse: (responseData: GetIssuesApiResponse) =>
        entityAdapter.setAll(initialState, responseData.issues),
    }),
    postIssues: build.mutation<PostIssuesApiResponse, PostIssuesApiArg>({
      query: (queryArg) => ({
        url: `/issues`,
        method: "POST",
        body: queryArg.issueInput,
      }),
      invalidatesTags: ["Issues"],
    }),
    putIssuesByIssueId: build.mutation<
      PutIssuesByIssueIdApiResponse,
      PutIssuesByIssueIdApiArg
    >({
      query: (queryArg) => ({
        url: `/issues/${queryArg.issueId}`,
        method: "PUT",
        headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImlhdCI6MTcyNTAzNzQ5NywiZXhwIjoxNzQwNTg5NDk3fQ.uj8Edcda52PVczeJn0KLXDu-XjzKMFMWJ2rH1uBThE4'},
        body: queryArg.issueInput,
      }),
      invalidatesTags: ["Issues"],
    }),
    deleteIssuesByIssueId: build.mutation<
      DeleteIssuesByIssueIdApiResponse,
      DeleteIssuesByIssueIdApiArg
    >({
      query: (queryArg) => ({
        url: `/issues/${queryArg.issueId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Issues"],
    }),
  }),
});
const selectEntryResult = (state: any) =>
  issuesData.endpoints.getIssues.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectIssues = entrySelectors.selectAll;
export const selectIssuesIds = entrySelectors.selectIds;
export const selectIssuesById = entrySelectors.selectById;
export type GetIssuesApiResponse = /** status 200 Successful response */ {
  issues?: Issue[];
};
export type GetIssuesApiArg = void;
export type PostIssuesApiResponse = /** status 200 Successful response */ Issue;
export type PostIssuesApiArg = {
  issueInput: IssueInput;
};
export type PutIssuesByIssueIdApiResponse =
  /** status 200 Successful response */ Issue;
export type PutIssuesByIssueIdApiArg = {
  issueId: number;
  issueInput: IssueInput;
};
export type DeleteIssuesByIssueIdApiResponse =
  /** status 200 Successful response */ Issue;
export type DeleteIssuesByIssueIdApiArg = {
  issueId: number;
};
export type Issue = {
  id?: number;
  title?: string;
  type?: string;
  status?: string;
  priority?: string;
  listPosition?: number;
  description?: string;
  descriptionText?: string;
  estimate?: number;
  timeSpent?: number;
  timeRemaining?: number;
  createdAt?: string;
  updatedAt?: string;
  reporterId?: number;
  projectId?: number;
  userIds?: number[];
};
export type IssueInput = {
  title: string;
  type: "task" | "bug" | "story";
  status: "backlog" | "selected" | "inprogress" | "done";
  priority: "highest" | "high" | "medium" | "low" | "lowest";
  listPosition: number;
  description?: string;
  estimate?: number;
  timeSpent?: number;
  timeRemaining?: number;
  reporterId: number;
  projectId: number;
  userIds?: number[];
};
export const {
  useGetIssuesQuery,
  usePostIssuesMutation,
  usePutIssuesByIssueIdMutation,
  useDeleteIssuesByIssueIdMutation,
} = issuesData;