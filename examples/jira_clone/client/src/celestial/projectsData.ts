import { createEntityAdapter, Dictionary, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState();
export const projectsData = createApi({
  reducerPath: "projects",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Projects"],
  endpoints: (build) => ({
    getProject: build.query<EntityState<any>, GetProjectApiArg>({
      query: () => ({ url: `/project`, headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImlhdCI6MTcyNTAzNzQ5NywiZXhwIjoxNzQwNTg5NDk3fQ.uj8Edcda52PVczeJn0KLXDu-XjzKMFMWJ2rH1uBThE4'} }),
      providesTags: ["Projects"],
      transformResponse: (responseData: GetProjectApiResponse) =>
        entityAdapter.setAll(initialState, responseData.projects),
    }),
    putProject: build.mutation<PutProjectApiResponse, PutProjectApiArg>({
      query: (queryArg) => ({
        url: `/project`,
        method: "PUT",
        body: queryArg.projectInput,
        headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImlhdCI6MTcyNTAzNzQ5NywiZXhwIjoxNzQwNTg5NDk3fQ.uj8Edcda52PVczeJn0KLXDu-XjzKMFMWJ2rH1uBThE4'}
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});
const selectEntryResult = (state: any) =>
  projectsData.endpoints.getProject.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectProjects = entrySelectors.selectAll;
export const selectProjectsIds = entrySelectors.selectIds;
export const selectProjectsById = entrySelectors.selectById;
export type GetProjectApiResponse =
  /** status 200 Successful response */ {projects: Project[]};
export type GetProjectApiArg = void;
export type PutProjectApiResponse =
  /** status 200 Successful response */ Project;
export type PutProjectApiArg = {
  projectInput: ProjectInput;
};
export type Project = {
  id?: number;
  name?: string;
  url?: string;
  description?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
};
export type ProjectInput = {
  name: string;
  url?: string;
  description?: string;
  category: string;
};
export const { useGetProjectQuery, usePutProjectMutation } = projectsData;
