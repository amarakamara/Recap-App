import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserInfoProvider(props) {
  const initialUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const initialUserID = JSON.parse(localStorage.getItem("userID"));
  const initialJwtToken = JSON.parse(localStorage.getItem("jwtToken"));

  const uid = initialUserID ? initialUserID : "";

  const tokenJWT = initialJwtToken ? initialJwtToken : "";

  const [userID, setUserID] = useState(uid);

  const [jwtToken, setJwtToken] = useState(tokenJWT);

  const [userInfo, setUserInfo] = useState(initialUserInfo);

  useEffect(() => {
    localStorage.setItem("userID", JSON.stringify(userID));
  }, [userID]);

  useEffect(() => {
    localStorage.setItem("jwtToken", JSON.stringify(jwtToken));
  }, [jwtToken]);

  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  const values = {
    userInfo,
    setUserInfo,
    userID,
    setUserID,
    jwtToken,
    setJwtToken,
  };
  return (
    <UserContext.Provider value={values}>{props.children}</UserContext.Provider>
  );
}
