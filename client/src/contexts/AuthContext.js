import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  // Check if there's an authentication state stored in localStorage
  const initialIsAuthenticated =
    localStorage.getItem("isAuthenticated") === "true";
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialIsAuthenticated
  );

  // Use useEffect to update localStorage when isAuthenticated changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [isAuthenticated]);

  const values = { isAuthenticated, setIsAuthenticated };

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
}
