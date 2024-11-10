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
    }),
    getCartItems: build.query<EntityState<any>, GetCartItemsApiArg>({
      query: () => ({ url: `/cart/items` }),
      providesTags: ["cart"],
      transformResponse: (responseData: GetCartItemsApiResponse) =>
        entityAdapter.setAll(initialState, responseData.cart),
    }),
    putCartAction: build.mutation<
      PutCartActionApiResponse,
      PutCartActionApiArg
    >({
      async onQueryStarted({ ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          cartData.util.updateQueryData("getCartItems", undefined, (cache) => {
            const replacement = cache.entities[patch.body.item_id];
            Object.assign(replacement, patch.body);
            Object.assign(cache.entities[patch.body.item_id], replacement);
          }),
        );
      },
      query: (queryArg) => ({
        url: `/cart/${queryArg.action}`,
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
export type PutCartActionApiResponse =
  /** status 200 Action performed successfully */ {
    message?: string;
  };
export type PutCartActionApiArg = {
  /** Action to perform on the cart (add or remove an item) */
  action: "add" | "remove";
  body: {
    /** ID of the item to add or remove */
    item_id: number;
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
  cart_id?: number;
  item_id?: number;
  quantity?: number;
};
export const {
  useGetCartQuery,
  useGetCartItemsQuery,
  usePutCartActionMutation,
} = cartData;
