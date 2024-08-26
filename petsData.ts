import { createEntityAdapter, Dictionary, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState();
export const petsData = createApi({
  reducerPath: "pets",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.example.com" }),
  tagTypes: ["Tasks", "Test", "Colors", "Status"],
  endpoints: (build) => ({
    getTasks: build.query<EntityState<any>, GetTasksApiArg>({
      query: () => ({ url: `/tasks` }),
      providesTags: ["Tasks"],
      transformResponse: (responseData: Task[]) =>
        entityAdapter.setAll(initialState, responseData),
    }),
    postTasks: build.mutation<PostTasksApiResponse, PostTasksApiArg>({
      query: (queryArg) => ({
        url: `/tasks`,
        method: "POST",
        body: queryArg.newTask,
      }),
      invalidatesTags: ["Tasks", "Test"],
    }),
    putTaskColor: build.mutation<PutTaskColorApiResponse, PutTaskColorApiArg>({
      query: (queryArg) => ({
        url: `/task/color`,
        method: "PUT",
        body: queryArg.updateTaskColor,
      }),
      invalidatesTags: ["Tasks"],
    }),
    putTaskStatus: build.mutation<
      PutTaskStatusApiResponse,
      PutTaskStatusApiArg
    >({
      query: (queryArg) => ({
        url: `/task/status`,
        method: "PUT",
        body: queryArg.updateTaskStatus,
      }),
      invalidatesTags: ["Tasks"],
    }),
    getColors: build.query<GetColorsApiResponse, GetColorsApiArg>({
      query: () => ({ url: `/colors` }),
      providesTags: ["Colors"],
    }),
    getStatus: build.query<GetStatusApiResponse, GetStatusApiArg>({
      query: () => ({ url: `/status` }),
      providesTags: ["Status", "Test"],
    }),
  }),
});
const selectEntryResult = (state) =>
  petsData.endpoints.getTasks.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectPets = entrySelectors.selectAll;
export const selectPetsIds = entrySelectors.selectIds;
export const selectPetsById = entrySelectors.selectById;
export type GetTasksApiResponse = /** status 200 A list of tasks */ Task[];
export type GetTasksApiArg = void;
export type PostTasksApiResponse =
  /** status 200 Task added successfully */ TaskResponse;
export type PostTasksApiArg = {
  newTask: NewTask;
};
export type PutTaskColorApiResponse =
  /** status 200 Task color updated successfully */ TaskResponse;
export type PutTaskColorApiArg = {
  updateTaskColor: UpdateTaskColor;
};
export type PutTaskStatusApiResponse =
  /** status 200 Task status updated successfully */ TaskResponse;
export type PutTaskStatusApiArg = {
  updateTaskStatus: UpdateTaskStatus;
};
export type GetColorsApiResponse = /** status 200 A list of colors */ Color[];
export type GetColorsApiArg = void;
export type GetStatusApiResponse =
  /** status 200 A list of statuses */ Status[];
export type GetStatusApiArg = void;
export type Task = {
  id?: number;
  text?: string;
  color?: number;
  status?: number;
};
export type TaskResponse = {
  message?: string;
  inserted?: Task;
};
export type NewTask = {
  text: string;
};
export type UpdateTaskColor = {
  task_id: number;
  color: number;
};
export type UpdateTaskStatus = {
  task_id: number;
  status: number;
};
export type Color = {
  id?: number;
  color?: string;
};
export type Status = {
  id?: number;
  status?: string;
};
export const {
  useGetTasksQuery,
  usePostTasksMutation,
  usePutTaskColorMutation,
  usePutTaskStatusMutation,
  useGetColorsQuery,
  useGetStatusQuery,
} = petsData;
