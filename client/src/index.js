import React from "react";
import reactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./utils/MainRoutes";
import { AuthProvider } from "./contexts/AuthContext";

const domNode = document.getElementById("root");

const root = reactDom.createRoot(domNode);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
