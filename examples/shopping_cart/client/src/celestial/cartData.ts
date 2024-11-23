import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const entityAdapter = createEntityAdapter();
const initialState: EntityState<any> = entityAdapter.getInitialState({
  ids: [],
  entities: {},
});
export const cartData = createApi({
  reducerPath: "cart",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001" }),
  tagTypes: ["cart"],
  endpoints: (build) => ({
    getCart: build.query<GetCartApiResponse, GetCartApiArg>({
      query: () => ({ url: `/cart` }),
      providesTags: ["cart"],
    }),
    getCartItems: build.query<EntityState<any>, GetCartItemsApiArg>({
      query: () => ({ url: `/cart/items` }),
      providesTags: ["cart"],
      transformResponse: (responseData: GetCartItemsApiResponse) =>
        entityAdapter.setAll(initialState, responseData.cart),
    }),
    putCartAdd: build.mutation<PutCartAddApiResponse, PutCartAddApiArg>({
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          cartData.util.updateQueryData("getCartItems", undefined, (cache) => {
            const replacement = cache.entities[patch.itemId];
            if (replacement===undefined) {
              return
            }
            Object.assign(replacement, patch.body);
            Object.assign(cache.entities[patch.itemId], replacement);
          }),
        );
      },
      query: (queryArg) => ({
        url: `/cart/add/${queryArg.itemId}`,
        method: "PUT",
        body: queryArg.body,
      }),
      invalidatesTags: ["cart"],
    }),
    putCartRemove: build.mutation<
      PutCartRemoveApiResponse,
      PutCartRemoveApiArg
    >({
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          cartData.util.updateQueryData("getCartItems", undefined, (cache) => {
            const replacement = cache.entities[patch.itemId];
            Object.assign(replacement, patch.body);
            Object.assign(cache.entities[patch.itemId], replacement);
          }),
        );
      },
      query: (queryArg) => ({
        url: `/cart/remove/${queryArg.itemId}`,
        method: "PUT",
        body: queryArg.body,
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});
const selectEntryResult = (state: any) =>
  cartData.endpoints.getCartItems.select()(state).data;
const entrySelectors = entityAdapter.getSelectors(
  (state) => selectEntryResult(state) ?? initialState,
);
export const selectCart = entrySelectors.selectAll;
export const selectCartIds = entrySelectors.selectIds;
export const selectCartById = entrySelectors.selectById;
export type GetCartApiResponse = /** status 200 Cart details */ Cart[];
export type GetCartApiArg = void;
export type GetCartItemsApiResponse = /** status 200 Cart items */ {
  cart: CartLineitem[];
};
export type GetCartItemsApiArg = void;
export type PutCartAddApiResponse =
  /** status 200 Action performed successfully */ {
    message?: string;
  };
export type PutCartAddApiArg = {
  /** Item id to add */
  itemId: number;
  body: {
    /** New quantity of the item_id */
    quantity: number;
  };
};
export type PutCartRemoveApiResponse =
  /** status 200 Action performed successfully */ {
    message?: string;
  };
export type PutCartRemoveApiArg = {
  /** Item id to remove */
  itemId: number;
  body: {
    /** New quantity of the item_id */
    quantity: number;
  };
};
export type Cart = {
  id?: number;
  cart_total?: number;
};
export type Error = {
  error?: string;
};
export type CartLineitem = {
  id?: number;
  quantity?: number;
};
export const {
  useGetCartQuery,
  useGetCartItemsQuery,
  usePutCartAddMutation,
  usePutCartRemoveMutation,
} = cartData;
