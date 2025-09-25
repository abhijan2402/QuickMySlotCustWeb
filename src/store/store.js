import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import authReducer from "../slices/authSlice";
import { profileApi } from "../services/profileApi";
import { categoryApi } from "../services/categoryApi";
import { supportApi } from "../services/supportApi";
import { vendorApi } from "../services/vendorApi";
import { wishiListApi } from "../services/wishListApi";
import { analyticsApi } from "../services/analyticsApi";
import { faqApi } from "../services/faqApi";
import { walletApi } from "../services/walletApi";
import { notificationApi } from "../services/notificationApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [supportApi.reducerPath]: supportApi.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [wishiListApi.reducerPath]: wishiListApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      supportApi.middleware,
      profileApi.middleware,
      vendorApi.middleware,
      wishiListApi.middleware,
      categoryApi.middleware,
      walletApi.middleware,
      analyticsApi.middleware,
      faqApi.middleware,
      notificationApi.middleware
    ),
});

export default store;
