import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const values = { userInfo, setUserInfo, isAuthenticated, setIsAuthenticated };

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
}
