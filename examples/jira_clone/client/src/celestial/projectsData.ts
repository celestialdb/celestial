import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState({
  ids: [],
  entities: {},
});
export const projectsData = createApi({
  reducerPath: "projects",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Projects"],
  endpoints: (build) => ({
    getProject: build.query<EntityState<any>, GetProjectApiArg>({
      query: () => ({ url: `/project` }),
      providesTags: ["Projects"],
      transformResponse: (responseData: GetProjectApiResponse) =>
        entityAdapter.setAll(initialState, responseData.projects),
    }),
    putProject: build.mutation<PutProjectApiResponse, PutProjectApiArg>({
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          projectsData.util.updateQueryData(
            "getProject",
            undefined,
            (cache) => {
              const replacement = cache.entities[patch.projectInput.projectId];
              Object.assign(replacement, patch.projectInput);
              Object.assign(
                cache.entities[patch.projectInput.projectId],
                replacement,
              );
            },
          ),
        );
      },
      query: (queryArg) => ({
        url: `/project`,
        method: "PUT",
        body: queryArg.projectInput,
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
  /** status 200 Successful response */ Projects;
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
export type Projects = {
  projects?: Project[];
};
export type ProjectInput = {
  projectId: number;
  name: string;
  url?: string;
  description?: string;
  category: string;
};
export const { useGetProjectQuery, usePutProjectMutation } = projectsData;
