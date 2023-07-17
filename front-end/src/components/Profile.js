import { useEffect, useState } from "react";
import "../styles/profile.css";
import { getCookieValue } from "../Utility/token_functions";

export default function Profile() {
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
      <div class="coffee-container">
        <div class="coffee">
          <div class="coffee-top"></div>
          <div class="coffee-body">
            <h1>But first, coffee</h1>
          </div>
        </div>
      </div>
      <div id="initial">{getInitials(username).toUpperCase()}</div>
      <div className="profileItemRowContainer">
        <div>Username:</div>
        <div className="profileItem">{username}</div>
      </div>
      <div className="profileItemRowContainer">
        <div>Email:</div>
        <div className="profileItem">{email}</div>
      </div>
      <a id="resetPassword">reset password</a>
    </div>
  );
}
