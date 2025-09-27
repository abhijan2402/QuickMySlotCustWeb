import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { CustomToastContainer } from "./components/CustomToastContainer.jsx";
import { LocationProvider } from "./context/LocationProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <LocationProvider>
        <App />
        <CustomToastContainer />
      </LocationProvider>
    </Provider>
  </StrictMode>
);
