import { createEntityAdapter, Dictionary, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState();
export const commentsData = createApi({
  reducerPath: "comments",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Comments"],
  endpoints: (build) => ({
    postComments: build.mutation<PostCommentsApiResponse, PostCommentsApiArg>({
      query: (queryArg) => ({
        url: `/comments`,
        method: "POST",
        body: queryArg.commentInput,
      }),
      invalidatesTags: ["Comments"],
    }),
    getComments: build.query<EntityState<any>, GetCommentsApiArg>({
      query: () => ({ url: `/comments`, headers: {Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImlhdCI6MTcyNTAzNzQ5NywiZXhwIjoxNzQwNTg5NDk3fQ.uj8Edcda52PVczeJn0KLXDu-XjzKMFMWJ2rH1uBThE4'} }),
      providesTags: ["Comments"],
      transformResponse: (responseData: GetCommentsApiResponse) =>
        entityAdapter.setAll(initialState, responseData),
    }),
    putCommentsByCommentId: build.mutation<
      PutCommentsByCommentIdApiResponse,
      PutCommentsByCommentIdApiArg
    >({
      query: (queryArg) => ({
        url: `/comments/${queryArg.commentId}`,
        method: "PUT",
        body: queryArg.commentInput,
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteCommentsByCommentId: build.mutation<
      DeleteCommentsByCommentIdApiResponse,
      DeleteCommentsByCommentIdApiArg
    >({
      query: (queryArg) => ({
        url: `/comments/${queryArg.commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});
const selectEntryResult = (state: any) =>
  commentsData.endpoints.getComments.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectComments = entrySelectors.selectAll;
export const selectCommentsIds = entrySelectors.selectIds;
export const selectCommentsById = entrySelectors.selectById;
export type PostCommentsApiResponse =
  /** status 200 Successful response */ Comment;
export type PostCommentsApiArg = {
  commentInput: CommentInput;
};
export type GetCommentsApiResponse = /** status 200 Successful response */ {
  issues?: Comment[];
};
export type GetCommentsApiArg = void;
export type PutCommentsByCommentIdApiResponse =
  /** status 200 Successful response */ Comment;
export type PutCommentsByCommentIdApiArg = {
  commentId: number;
  commentInput: CommentInput;
};
export type DeleteCommentsByCommentIdApiResponse =
  /** status 200 Successful response */ Comment;
export type DeleteCommentsByCommentIdApiArg = {
  commentId: number;
};
export type Comment = {
  id?: number;
  body?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  issueId?: number;
};
export type CommentInput = {
  body: string;
  userId: number;
  issueId: number;
};
export const {
  usePostCommentsMutation,
  useGetCommentsQuery,
  usePutCommentsByCommentIdMutation,
  useDeleteCommentsByCommentIdMutation,
} = commentsData;
