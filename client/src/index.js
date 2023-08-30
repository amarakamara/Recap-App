import React from "react";
import reactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./components/MainRoutes";

const domNode = document.getElementById("root");

const root = reactDom.createRoot(domNode);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
