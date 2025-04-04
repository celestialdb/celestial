import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState({
  ids: [],
  entities: {},
});
export const tasksData = createApi({
  reducerPath: "tasks",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001" }),
  tagTypes: ["Tasks"],
  endpoints: (build) => ({
    getTasks: build.query<EntityState<any>, GetTasksApiArg>({
      query: () => ({ url: `/tasks` }),
      providesTags: ["Tasks"],
      transformResponse: (responseData: GetTasksApiResponse) =>
        entityAdapter.setAll(initialState, responseData),
    }),
    postTasks: build.mutation<PostTasksApiResponse, PostTasksApiArg>({
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          tasksData.util.updateQueryData("getTasks", undefined, (cache) => {
            Object.assign(patch.newTask, { id: 0 });
            Object.assign(cache.entities, { 0: patch.newTask });
            cache.ids.push(0);
          }),
        );
      },
      query: (queryArg) => ({
        url: `/tasks`,
        method: "POST",
        body: queryArg.newTask,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: build.mutation<DeleteTaskApiResponse, DeleteTaskApiArg>({
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          tasksData.util.updateQueryData("getTasks", undefined, (cache) => {
            const index = cache.ids.indexOf(patch.deleteTask.task_id);
            cache.ids.splice(index, 1);
            delete cache.entities[patch.deleteTask.task_id];
          }),
        );
      },
      query: (queryArg) => ({
        url: `/task`,
        method: "DELETE",
        body: queryArg.deleteTask,
      }),
      invalidatesTags: ["Tasks"],
    }),
    putTaskColor: build.mutation<PutTaskColorApiResponse, PutTaskColorApiArg>({
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          tasksData.util.updateQueryData("getTasks", undefined, (cache) => {
            const replacement = cache.entities[patch.updateTaskColor.task_id];
            Object.assign(replacement, patch.updateTaskColor);
            Object.assign(
              cache.entities[patch.updateTaskColor.task_id],
              replacement,
            );
          }),
        );
      },
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
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          tasksData.util.updateQueryData("getTasks", undefined, (cache) => {
            const replacement = cache.entities[patch.updateTaskStatus.task_id];
            Object.assign(replacement, patch.updateTaskStatus);
            Object.assign(
              cache.entities[patch.updateTaskStatus.task_id],
              replacement,
            );
          }),
        );
      },
      query: (queryArg) => ({
        url: `/task/status`,
        method: "PUT",
        body: queryArg.updateTaskStatus,
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});
const selectEntryResult = (state: any) =>
  tasksData.endpoints.getTasks.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectTasks = entrySelectors.selectAll;
export const selectTasksIds = entrySelectors.selectIds;
export const selectTasksById = entrySelectors.selectById;
export type GetTasksApiResponse = /** status 200 A list of tasks */ Task[];
export type GetTasksApiArg = void;
export type PostTasksApiResponse =
  /** status 200 Task added successfully */ TaskResponse;
export type PostTasksApiArg = {
  newTask: NewTask;
};
export type DeleteTaskApiResponse =
  /** status 200 Task deleted successfully */ DeleteResponse;
export type DeleteTaskApiArg = {
  deleteTask: DeleteTask;
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
export type DeleteResponse = {
  message?: string;
  inserted?: {
    id?: number;
  };
};
export type DeleteTask = {
  task_id: number;
};
export type UpdateTaskColor = {
  task_id: number;
  color: number;
};
export type UpdateTaskStatus = {
  task_id: number;
  status: number;
};
export const {
  useGetTasksQuery,
  usePostTasksMutation,
  useDeleteTaskMutation,
  usePutTaskColorMutation,
  usePutTaskStatusMutation,
} = tasksData;
