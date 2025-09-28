import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GrStatusDisabled } from "react-icons/gr";
export const vendorTransactionApi = createApi({
  reducerPath: "vendorTransactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get vendorTransaction (GET request)
    getvendorTransaction: builder.query({
      query: () => ({
        url: `vendor-transactions/list`,
        method: "GET",
      }),
      providesTags: ["vendorTransaction"],
    }),
    // Get SLots (GET request)
    getSlots: builder.query({
      query: (slotId) => {
        if (!slotId) return "";
        return {
          url: `customer/services/${slotId}/available-slots`,
          method: "GET",
        };
      },
    }),

    // Get Bookings
    getvendorBooking: builder.query({
      query: ({ status } = {}) => {
        const url = status
          ? `customer/bookings/list?status=${status}`
          : `customer/bookings/list`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["vendorBooking"],
    }),


    // Get bokking details
    getvendorBookingDetails: builder.query({
      query: (id) => {
        return {
          url: `customer/booking/${id}`,
          method: "GET",
        };
      },
      providesTags: ["vendorBooking"],
    }),

    // Accept Booking
    acceptBooking: builder.mutation({
      query: (id) => ({
        url: `booking/accepted/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["vendorBooking"],
    }),

    // Reject Booking
    rejectBooking: builder.mutation({
      query: (id) => ({
        url: `booking/reject/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["vendorBooking"],
    }),
    // Completed Booking
    completedBooking: builder.mutation({
      query: (id) => ({
        url: `booking/completed/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["vendorBooking"],
    }),
  }),
});

export const {
  useGetvendorTransactionQuery,
  useGetvendorBookingQuery,
  useAcceptBookingMutation,
  useRejectBookingMutation,
  useCompletedBookingMutation,
  useGetSlotsQuery,
  useGetvendorBookingDetailsQuery
} = vendorTransactionApi;
