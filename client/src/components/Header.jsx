import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
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
        localStorage.clear();
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {showMobileMenu && (
        <div className="mobile-menu md:invisible lg:invisible absolute top-0 right-0 z-50 max-w-50vw w-vw40 h-auto bg-white">
          <div className="top w-full py-1.5 px-0 m-0 text-white">
            <CloseIcon onClick={closeMenu} />
          </div>
          <ul className="menu-ul my-2 mx-0">
            <li>
              <NavLink className="link-mobile" to="/home">
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
          <div className="w-full h-auto bg-blue px-2.5 py-1">
            <button className="text-xl text-white" onClick={handleLogOut}>
              Log out <LogoutIcon className="ml-2 text-sm" />
            </button>
          </div>
        </div>
      )}
      <header className="py-2 px-3">
        <div className="header-inner w-full h-full flex flex-row flex-nowrap justify-center basis-1/2 m-0">
          <div className="logo-div relative w-full overflow-hidden">
            <img
              className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/3  top-6 w-32"
              src="assets/logoPng.png"
              alt="logo"
            />
          </div>
          <div className="relative w-full h-auto">
            <button
              onClick={openMenu}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 -right-5 top-5 text-white md:invisible lg:invisible"
            >
              <MenuIcon fontSize="large" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
