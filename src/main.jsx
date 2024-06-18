import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./Routes/index.jsx";
import Footer from "./components/common/Footer/index.jsx";
import "react-quill/dist/quill.snow.css";
import { app } from "./FirebaseConfig.js";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
        <ToastContainer />
        {/* <Footer /> */}
    </React.StrictMode>
);
