import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["payment"],
  endpoints: (builder) => ({
    // 🔹 Razorpay APIs
    createOrder: builder.mutation({
      query: (formdata) => ({
        url: `customer/bookings`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["payment"],
    }),
    verifyPayment: builder.mutation({
      query: (formdata) => ({
        url: `customer/booking-verify`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["payment"],
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyPaymentMutation } = paymentApi;
