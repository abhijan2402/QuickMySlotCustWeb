import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const vendorApi = createApi({
  reducerPath: "vendorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get vendor (GET request)
    getvendor: builder.query({
      query: ({ id, lat, long }) => {
        const params = new URLSearchParams();

        if (id) params.append("service_category", id);
        if (lat) params.append("lat", lat);
        if (long) params.append("long", long);

        return {
          url: `customer/vendor/list/Auth?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["vendor"],
    }),

    // Get Vendor Schedule
    getSlotsShedule: builder.query({
      query: (id) => ({
        url: `customer/services/${id}/available-slots`,
        method: "GET",
      }),
      providesTags: ["abc"],
    }),
    // Get Customer Appointments
    getAppointments: builder.query({
      query: (id) => ({
        url: `customer/bookings/list`,
        method: "GET",
      }),
      providesTags: ["abc"],
    }),
    // Get services by sub-services (GET request)
    getServices: builder.query({
      query: ({ id }) => ({
        url: `customer/sub-category/${id}`,
        method: "POST",
      }),
      providesTags: ["vendor"],
    }),
    // Get vendor (GET request)
    getvendorPromoCode: builder.query({
      query: (id) => {
        if (!id) return;
        return { url: `customer/promo-codes/${id}`, method: "GET" };
      },
      providesTags: ["vendor"],
    }),

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
      invalidatesTags: ["Wish", "vendor"],
    }),
    // Delete Wish Item
    removeWishList: builder.mutation({
      query: (id) => ({
        url: `customer/wishlist-remove/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Wish", "vendor"],
    }),

    // Cart List
    getCartList: builder.query({
      query: (id) => ({
        url: `customer/cart`,
        method: "GET",
      }),
      providesTags: ["cart"],
    }),
    // Add to Cart
    addToCart: builder.mutation({
      query: (fd) => ({
        url: "customer/cart/add",
        method: "POST",
        body: fd,
      }),
      invalidatesTags: ["cart"],
    }),
    // Delete Cart Item
    removeCartList: builder.mutation({
      query: (id) => ({
        url: `customer/cart-remove/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});

export const {
  useGetvendorQuery,
  useGetvendorPromoCodeQuery,
  useAddToCartMutation,
  useGetCartListQuery,
  useGetServicesQuery,
  useRemoveCartListMutation,
  useAddToWishMutation,
  useGetWishListQuery,
  useRemoveWishListMutation,
  useGetAppointmentsQuery,
} = vendorApi;
