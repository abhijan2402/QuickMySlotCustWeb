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
      query: (id) => ({
        url: `customer/vendor/list/Auth?service_category=${id}`,
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),
    // Get vendor (GET request)
    getvendorPromoCode: builder.query({
      query: (id) => ({
        url: `customer/promo-codes/${id}`,
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),
  }),
});

export const { useGetvendorQuery, useGetvendorPromoCodeQuery } = vendorApi;
