import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserInfoProvider(props) {
  const initialUserID = localStorage.getItem("userID");
  const initialUserInfo = localStorage.getItem("userInfo");
  const [userID, setUserID] = useState(initialUserID);

  const [userInfo, setUserInfo] = useState(initialUserInfo);

  useEffect(() => {
    localStorage.setItem("userID", userID);
    localStorage.setItem("userInfo", userInfo);
  }, [userID, userInfo]);

  const values = { userInfo, setUserInfo, userID, setUserID };
  return (
    <UserContext.Provider value={values}>{props.children}</UserContext.Provider>
  );
}
