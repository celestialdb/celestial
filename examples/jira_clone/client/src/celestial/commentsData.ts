import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState({
  ids: [],
  entities: {},
});
export const commentsData = createApi({
  reducerPath: "comments",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Comments"],
  endpoints: (build) => ({
    postComments: build.mutation<PostCommentsApiResponse, PostCommentsApiArg>({
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          commentsData.util.updateQueryData(
            "getComments",
            undefined,
            (cache) => {
              Object.assign(patch.commentInput, { id: 0 });
              Object.assign(cache.entities, { 0: patch.commentInput });
              cache.ids.push(0);
            },
          ),
        );
      },
      query: (queryArg) => ({
        url: `/comments`,
        method: "POST",
        body: queryArg.commentInput,
      }),
      invalidatesTags: ["Comments"],
    }),
    getComments: build.query<EntityState<any>, GetCommentsApiArg>({
      query: () => ({ url: `/comments` }),
      providesTags: ["Comments"],
      transformResponse: (responseData: GetCommentsApiResponse) =>
        entityAdapter.setAll(initialState, responseData.comment),
    }),
    putCommentsByCommentId: build.mutation<
      PutCommentsByCommentIdApiResponse,
      PutCommentsByCommentIdApiArg
    >({
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          commentsData.util.updateQueryData(
            "getComments",
            undefined,
            (cache) => {
              const replacement = cache.entities[patch.commentId];
              Object.assign(replacement, patch.commentInput);
              Object.assign(cache.entities[patch.commentId], replacement);
            },
          ),
        );
      },
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
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          commentsData.util.updateQueryData(
            "getComments",
            undefined,
            (cache) => {
              const index = cache.ids.indexOf(patch.commentId);
              cache.ids.splice(index, 1);
              delete cache.entities[patch.commentId];
            },
          ),
        );
      },
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
  comment?: Comment[];
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
