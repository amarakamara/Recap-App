import React from "react";
import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Menu() {
  return (
    <nav className="menu invisible md:visible lg:visible shadow-md flex flex-col flex-grow justify-center items-center w-auto h-96 my-auto mx-0 pt-5 px-2 pb-2.5 z-50">
      <ul>
        <li>
          <NavLink className="link-items" to="/home">
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
