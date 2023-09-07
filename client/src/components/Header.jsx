import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import CancelButton from "./CancelButton";
import MenuIcon from "@mui/icons-material/Menu";
//import { useUser } from "../contexts/UserContext";

const api_base = "http://localhost:3001";

export default function Header(props) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
 // const { userID } = useUser();
  const navigate = useNavigate();

  const openMenu = () => {
    setShowMobileMenu(true);
  };
  const closeMenu = () => {
    setShowMobileMenu(false);
  };
  const handleLogOut = async () => {
    try {
      const response = await fetch(api_base + "/logout", {
        method: "POST",
      });

      if (response.ok) {
        localStorage.removeItem("userID");
        localStorage.removeItem("userInfo");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
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
            <button onClick={handleLogOut}>Log Out</button>
          </div>
        </div>
      </header>
    </>
  );
}
