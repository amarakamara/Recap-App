import React, { useState } from "react";
import Header from "../components/Header";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const api_base = "http://localhost:3001";

export default function Register() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  console.log(isAuthenticated);

  const [registerInfo, setRegisterInfo] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
  });

  //HandleChange
  const handleChange = (event) => {
    const { name, value } = event.target;

    setRegisterInfo((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  //HandleSubmit

  function handleSubmit(event) {
    event.preventDefault();

    fetch(api_base + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstName: registerInfo.fName,
        lastName: registerInfo.lName,
        username: registerInfo.email,
        password: registerInfo.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          console.log(data.authenticated);
          setIsAuthenticated(data.authenticated);
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
      <Header />
      <form method="post" onSubmit={handleSubmit} className="register-form">
        <label htmlFor="user-fName">First Name</label>
        <input
          onChange={handleChange}
          id="user-fName"
          name="fName"
          type="text"
          value={registerInfo.fName}
          placeholder="first name"
          autoComplete="on"
          required
        />

        <label htmlFor="user-lName">Last Name</label>
        <input
          onChange={handleChange}
          id="user-lName"
          name="lName"
          type="text"
          value={registerInfo.lName}
          placeholder="last name"
          autoComplete="on"
          required
        />

        <label htmlFor="user-email">Email</label>
        <input
          onChange={handleChange}
          id="user-email"
          name="email"
          type="text"
          value={registerInfo.email}
          placeholder="email"
          autoComplete="on"
          required
        />

        <label htmlFor="user-password">Password</label>
        <input
          onChange={handleChange}
          id="user-password"
          type="password"
          name="password"
          value={registerInfo.password}
          placeholder="password"
          autoComplete="off"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
