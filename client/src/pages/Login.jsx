import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";

const api_base = process.env.REACT_APP_API_ENDPOINT;

export default function Login() {
  const { setIsAuthenticated } = useAuth();
  const { setUserID } = useUser();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 2000);

      return () => clearTimeout(timer); // Clear the timer if component unmounts
    }
  }, [showError]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginInfo((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  function handleSubmit(event) {
    event.preventDefault();

    fetch(api_base + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: loginInfo.email,
        password: loginInfo.password,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.authenticated) {
          setIsAuthenticated(res.authenticated);
          const uid = res.user._id.toString();
          setUserID(uid);
          localStorage.setItem("userID", JSON.stringify(uid));
          navigate("/home", { replace: true });
        } else {
          setIsAuthenticated(res.authenticated);
          setShowError(true);
          setErrorMessage(res.message);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <div className="container-full w-screen h-screen absolute p-0 m-0 overflow-hidden">
      <div className="flex flex-row w-full h-full m-0 p-0">
        <div className="w-full h-full basis-full text-center md:relative md:bg-white md:overflow-hidden lg:relative lg:bg-white lg:overflow-hidden md:w-full md:h-full md:basis-1/2 lg:w-full lg:h-full lg:basis-1/2">
          <div className="flex flex-col justify-center items-center absolute inset-0 m-auto max-w-80vw max-h-80vh w-80vw h-80vh text-center lg:w-500 md:w-400 lg:h-auto md:h-auto lg:py-5 lg:px-7 md:p-3 text-blue">
            <div className="w-60">
              <img
                className="hidden lg:block"
                src="assets/logo-blue.png"
                alt="logo"
              />
              <img
                className="block lg:hidden"
                src="assets/logoPng.png"
                alt="logo"
              />
            </div>
            <form
              onSubmit={handleSubmit}
              method="post"
              className="logReg-form bg-white w-full h-auto rounded-lg mt-5 mx-0 mb-8 py-7 px-5"
            >
              <div>
                <h2 className="lg:text-2xl md:text-xl font-jost text-2xl">
                  WELCOME BACK
                </h2>
                <p className="text-sm md:text-xs lg:text-sm">
                  Enter your login infos below to gain access.
                </p>
              </div>
              {showError && (
                <div>
                  <p className="text-sm md:text-xs text-red">{errorMessage}</p>
                </div>
              )}

              <input
                onChange={handleChange}
                id="login-email"
                name="email"
                type="text"
                value={loginInfo.email}
                autoComplete="on"
                placeholder="Enter your email"
                required
              />
              <input
                onChange={handleChange}
                id="current-password"
                name="password"
                type="password"
                value={loginInfo.password}
                autoComplete="off"
                placeholder="Enter your password"
                required
              />
              <button
                className="rounded-lg w-full py-1.5 px-0 text-base font-normal text-white cursor-pointer font-poppins"
                type="submit"
              >
                Login
              </button>
            </form>
            <div>
              <NavLink
                className="text-white md:text-blue lg:text-blue no-underline text-xs font-medium lg:text-sm md:text-sm"
                to="/register"
              >
                Don't have an account? Let's make you one!
              </NavLink>
            </div>
          </div>
        </div>
        <div className="item-1 item-1 invisible md:visible lg:visible md:relative lg:relative md:overflow-hidden lg:overflow-hidden md:bg-cover lg:bg-cover md:w-full md:h-full md:basis-1/2 lg:w-full lg:h-full lg:basis-1/2 ">
          <img
            className="logReg-img lg:w-full lg:h-full md:w-full md:h-full object-cover"
            src="https://img.freepik.com/free-photo/business-financial-concept-with-crumpled-paper-wads-spiral-notebook-pen-blue-background-flat-lay_176474-6551.jpg?w=996&t=st=1696861477~exp=1696862077~hmac=215eb8a63131a5a3c179f2c1f036819d0bd794fd1ece1e97301ee12c69ea7c97"
            alt="note book"
          />
        </div>
      </div>
    </div>
  );
}
