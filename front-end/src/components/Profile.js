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

  const getInitials = (name) => {
    const names = name.split(" ");
    let initials = "";
    names.forEach((n) => {
      initials += n[0];
    });
    return initials;
  };

  return (
    <div id="profileContainer">
      <h1 id="profileTitle">Profile</h1>
      <div id="initial">{getInitials(username).toUpperCase()}</div>
      <div className="profileItem">{username}</div>
      <div className="profileItem">{email}</div>
    </div>
  );
}
