import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const wishiListApi = createApi({
  reducerPath: "wishiListApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Wish List
    getWishList: builder.query({
      query: (id) => ({
        url: `customer/wishlist`,
        method: "GET",
      }),
      providesTags: ["Wish"],
    }),
    // Add to Wish
    addToWish: builder.mutation({
      query: (fd) => ({
        url: `customer/wishlist-add`,
        method: "POST",
        body: fd,
      }),
      invalidatesTags: ["Wish"],
    }),
    // Delete Wish Item
    removeWishList: builder.mutation({
      query: (id) => ({
        url: `customer/wishlist-remove/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Wish"],
    }),
  }),
});

export const {
  useAddToWishMutation,
  useGetWishListQuery,

  useRemoveWishListMutation,
} = wishiListApi;
