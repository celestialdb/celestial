import { emptySplitApi as api } from "./emptyApi";

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



const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksApiResponse, GetTasksApiArg>({
      query: () => ({ url: `/tasks` }),
    }),
    postTasks: build.mutation<PostTasksApiResponse, PostTasksApiArg>({
      query: (queryArg) => ({
        url: `/tasks`,
        method: "POST",
        body: queryArg.newTask,
      }),
    }),
    putTaskColor: build.mutation<PutTaskColorApiResponse, PutTaskColorApiArg>({
      query: (queryArg) => ({
        url: `/task/color`,
        method: "PUT",
        body: queryArg.updateTaskColor,
      }),
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
    }),
    getColors: build.query<GetColorsApiResponse, GetColorsApiArg>({
      query: () => ({ url: `/colors` }),
    }),
    getStatus: build.query<GetStatusApiResponse, GetStatusApiArg>({
      query: () => ({ url: `/status` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as petApi };


export const {
  useGetTasksQuery,
  usePostTasksMutation,
  usePutTaskColorMutation,
  usePutTaskStatusMutation,
  useGetColorsQuery,
  useGetStatusQuery,
} = injectedRtkApi;
