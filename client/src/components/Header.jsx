import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import CancelButton from "./CancelButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header(props) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const openMenu = () => {
    setShowMobileMenu(true);
  };
  const closeMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <>
      {showMobileMenu && (
        <div className="mobile-menu">
          <div className="top">
            <CancelButton click={closeMenu} />
          </div>
          <ul>
            <li>
              <NavLink className="link-mobile" to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className="link-mobile" to="/collections">
                Collections
              </NavLink>
            </li>
            <li>
              <NavLink className="link-mobile" to="/favourites">
                Favourites
              </NavLink>
            </li>
          </ul>
        </div>
      )}
      <header>
        <div className="header-inner">
          <div className="logo-div">
            <Logo />
          </div>
          <div className="btn-div">
            <button onClick={openMenu}>
              <MenuIcon fontSize="large" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
