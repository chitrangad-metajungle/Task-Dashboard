import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "../styles/styles.css"

export default function Login(params) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [FAuth, setAuth] = useState(false);
  const [user, setUser] = useState({});
  const [showLogin, setShowLogin] = useState(true);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const loginUrl = "http://127.0.0.1:10000/auth/login";
  const generateOtp = "http://127.0.0.1:10000/auth/generate_two_factor_otp";
  const validateOtp = "http://127.0.0.1:10000/auth/validate_two_factor_otp";

  const handleOtpChange = (event) => {
    const inputOtp = event.target.value;
    if (/^\d{0,6}$/.test(inputOtp)) {
      setOtp(inputOtp);
      setError('');
    } else {
      setError('Please enter a 6-digit number.');
    }
  };

  const handleSubmitOtp = async (event) => {
    event.preventDefault();

    if (otp.length === 6) {
        // Perform OTP verification logic
        console.log('Verifying OTP:', otp);
        // Call API or perform other actions as needed
        const generateOtp_response = await axios.post(validateOtp, {
            username,
            password,
            otp
        });
        if (generateOtp_response.status == 200) {
            window.location.href = "/";
        } else {
            alert("Failure to generate OTP!");
        }

    } else {
        alert("Failure to generate OTP!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const login_response = await axios.post(loginUrl, {
        username,
        password,
      });
      console.log(login_response);

      if (login_response.status == 200) {
        setAuth(true);
        const generateOtp_response = await axios.post(generateOtp, {
          username,
          password,
        });
        if (generateOtp_response.status == 200) {
          setUser(user);
          setShowLogin(false);
        } else {
          alert("Failure to generate OTP!");
        }
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
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
