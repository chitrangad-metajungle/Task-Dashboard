import { useEffect, useState } from "react";
import "../styles/profile.css";
import { getCookieValue } from "../Utility/token_functions";

export default function Profile({ closeFunction }) {
  const [username, setUsername] = useState("N/A");
  const [email, setEmail] = useState("N/A");

  function getUserInfo() {
    const userInfo = JSON.parse(getCookieValue("user"));
    return userInfo;
  }

  useEffect(() => {
    const userInfo = getUserInfo();
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, []);

  return (
    <div id="profileContainer">
      <h1>Profile</h1>
      <div className="profileItem">Username:{username}</div>
      <div className="profileItem">EmailAddress:{email}</div>
    </div>
  );
}
