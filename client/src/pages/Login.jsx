import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const api_base = "http://localhost:3001";

export default function Login() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  console.log(isAuthenticated);

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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
      .then((data) => {
        if (data.user) {
          setIsAuthenticated(true);
          navigate("/home");
        } else {
          console.log("something happened");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} method="post" className="login-form">
        <label htmlFor="login-email">Email</label>
        <input
          onChange={handleChange}
          id="login-email"
          name="email"
          type="text"
          value={loginInfo.email}
          autoComplete="on"
          required
        />
        <label htmlFor="current-password">Password</label>
        <input
          onChange={handleChange}
          id="current-password"
          name="password"
          type="password"
          value={loginInfo.password}
          autoComplete="off"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
