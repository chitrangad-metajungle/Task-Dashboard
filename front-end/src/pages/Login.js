import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "../styles/styles.css"
import {setCookie} from "../Utility/token_functions"

export default function Login(params) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const loginUrl = "http://127.0.0.1:10000/auth/login";
  const generateOtp = "http://127.0.0.1:10000/auth/generate_two_factor_otp";
  const validateOtp = "http://127.0.0.1:10000/auth/validate_two_factor_otp";

  const handleOtpChange = (event) => {
    const inputOtp = event.target.value;

    if (/^\d{0,6}$/.test(inputOtp) && inputOtp.length==6) {
      setError('');
    } else {
      setError('Please enter a 6-digit number.');
    }
    setOtp(inputOtp);
  };

  const handleSubmitOtp = async (event) => {
    event.preventDefault();

    // Call API or perform other actions as needed
    const generateOtp_response = await axios.post(validateOtp, {
        email,
        otp
    });

    if (generateOtp_response.status == 200) {
        setError("");
        setCookie("token", generateOtp_response.data.token, 1);
        window.location.href = "/";
    } else {
      setError("OTP Not Valid!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const login_response = await axios.post(loginUrl, {
        username,
        password,
      });

      if (login_response.status == 200) {
        const email_holder = login_response.data.user.email
        const generateOtp_response = await axios.post(generateOtp, {
          "email" : email_holder,
        });

        if (generateOtp_response.status == 200) {
          setUser(login_response.data.user);
          setEmail(login_response.data.user.email);
          setShowLogin(false);
          setError("");
        } else {
          setError("Failure to generate OTP! Please Try Again!");
        }

      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      setError("An error occurred during login: "+ error + ". Please Try Again!");
    }
  };

  return (
    <div>
      {showLogin ? 
        <div className="container">
            <div className="card">
              <form onSubmit={handleSubmit} className="box">
                <h1>Login</h1>
                  <p className="ss">Please Enter your Password!</p>
                  <input type="text" name="" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                  <input type="password" name ="" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                  <a className="forgot ss" href="#">Forgot password?</a>
                  {error && <div style={{ color: 'red' }}>{error}</div>}
                  <input type="submit" className="button" value="Login" href="#"></input>
                  <a className="forgot text-info" to="/register" href="#">Register</a>
              </form>
          </div>
        </div>
        :
        <div className="container">
          <div  className="card">
              <form onSubmit={handleSubmitOtp} className="box">
                  <h2>OTP Verification</h2>
                  <p className="ss">OTP has been sent to your Email!</p>
                  <input type="text" value={otp} onChange={handleOtpChange} />
                  {error && <div style={{ color: 'red' }}>{error}</div>}
                  <button type="submit">Verify OTP</button>
              </form>
          </div>
        </div>
      }
    </div>
  );
}
