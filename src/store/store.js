import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import authReducer from "../slices/authSlice";
import { profileApi } from "../services/profileApi";
import { categoryApi } from "../services/categoryApi";
import { supportApi } from "../services/supportApi";
import { vendorApi } from "../services/vendorApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [supportApi.reducerPath]: supportApi.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      supportApi.middleware,
      profileApi.middleware,
      vendorApi.middleware,
      categoryApi.middleware
    ),
});

export default store;
