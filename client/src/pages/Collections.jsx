import React from "react";
import { useUser } from "../contexts/UserContext";

const api_base = "http://localhost:3001";

export default function Collections() {
  const { userID } = useUser();

  const getUserInfo = async () => {
    const response = await fetch(api_base + `/user/${userID}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json(); // Note: Added 'await' here
    console.log(data);
  };

  return (
    <div>
      <h1>Collections</h1>;<button onClick={getUserInfo}>getUserInfo</button>
    </div>
  );
}
