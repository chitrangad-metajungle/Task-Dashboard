import { useState } from "react";
import "../styles/profile.css";

export default function Profile({ closeFunction }) {
  const [username, setUsername] = useState("N/A");
  const [email, setEmail] = useState("N/A");

  async function getUserInfo() {}

  return (
    <div id="profileContainer">
      <h1>Profile</h1>
      <div>Username:{username}</div>
      <div>EmailAddress:{email}</div>
      <button onClick={closeFunction}>X</button>
    </div>
  );
}
