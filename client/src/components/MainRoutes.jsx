import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import EditNote from "../pages/EditNote";
import Favourites from "../pages/Favourites";
import Collections from "../pages/Collections";
import View from "../pages/View";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/edit/:noteId" element={<EditNote />} />
      <Route path="/view/:noteId" element={<View />} />
    </Routes>
  );
}
