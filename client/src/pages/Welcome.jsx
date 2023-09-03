import React from "react";
import { NavLink } from "react-router-dom";

export default function Welcome() {
  return (
    <div>
      <h2>Welcome to the Recap App</h2>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/register">Register</NavLink>
    </div>
  );
}
