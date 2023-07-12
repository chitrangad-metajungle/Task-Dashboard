import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default function Login(params) {
    const Login = () => {
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
      
        const handleSubmit = (e) => {
          e.preventDefault();
      
          const { username, password } = this.state;
      
          fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                // Redirect the user to the home page.
                window.location.href = "/";
              } else {
                // Display an error message to the user.
                alert("Invalid username or password.");
              }
            });
        };
      

    return (<Router>
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Login" />
      </form>
      <Link to="/register">Register</Link>
    </div>
  </Router>
);
};
}
