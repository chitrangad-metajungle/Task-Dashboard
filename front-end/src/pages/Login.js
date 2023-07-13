import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/styles.css"

export default function Login(params) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [FAuth, setAuth] = useState(false);

  const backEndUrl = "http://localhost:8000/api/login";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(backEndUrl, {
        username,
        password,
      });
      console.log("Calling Login")
      const data = response.data;

      if (data.success) {
        setAuth(true);
        window.location.href = "/";
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  return (
    // <div class = "d-flex pt-5 justify-content-center">
      <div class="container">
        <div class="row d-flex jsutify-content-center mt-5">
          <div class="col-md-6">
            <div class="card">
              <form onSubmit={handleSubmit} class="box">
                <h1>Login</h1>
                  <p class="ss">Please Enter your Password!</p>
                  <input type="text" name="" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                  <input type="password" name ="" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                  <a class="forgot ss" href="#">Forgot password?</a>
                  <input type="submit" name="" value="Login" href="#"></input>
                  <a class="forgot text-info" to="/register" href="#">Register</a>
              </form>
            </div>
          </div> 
        </div>
      {/* </div> */}

      {/* <n></n>
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
      <br></br>
      {setAuth} && (
      <div>
        <p>"Email Sent"</p>
      </div>
      )<Link to="/register">Register</Link>*/}
    </div>
  );
}
