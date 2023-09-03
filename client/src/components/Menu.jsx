import React from "react";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Menu() {
  return (
    <nav className="menu">
      <ul>
        <li>
          <NavLink className="link-items" to="/">
            <HomeIcon fontSize="large" />
          </NavLink>
        </li>
        <li>
          <NavLink className="link-items" to="/collections">
            <CollectionsBookmarkIcon fontSize="large" />
          </NavLink>
        </li>
        <li>
          <NavLink className="link-items" to="/favourites">
            <FavoriteIcon fontSize="large" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
