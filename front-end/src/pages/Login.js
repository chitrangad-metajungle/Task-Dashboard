import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "../styles/styles.css"
import {setCookie, getCookieValue} from "../Utility/token_functions"
import Loading from "../components/Loading";

export default function Login(params) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState('');
  const [enableOtpButton, setEnableOtpButton] = useState(false);
  const [error, setError] = useState('');

  const loginUrl = "http://127.0.0.1:10000/auth/login";
  const generateOtp = "http://127.0.0.1:10000/auth/generate_two_factor_otp";
  const validateOtp = "http://127.0.0.1:10000/auth/validate_two_factor_otp";

  const handleOtpChange = (event) => {
    const inputOtp = event.target.value;

    if (/^\d{0,6}$/.test(inputOtp) && inputOtp.length==6) {
      setError('');
      setEnableOtpButton(true);
    } else {
      setError('Please enter a 6-digit number.');
    }
    setOtp(inputOtp);
  };

  const handleSubmitOtp = async (event) => {
    event.preventDefault();

    // Call API or perform other actions as needed
    setLoading(true)
    axios.post(validateOtp, {
        email,
        otp
    }).then(generateOtp_response => {
      if (generateOtp_response.status == 200) {
        setError("");
        setCookie("token", generateOtp_response.data.token, 1);
        window.location.href = "/";
      } else {
        setError("OTP Not Valid!");
      }

      setLoading(false)
    }).catch(error => {
      if(error.response.status == 404)
        setError("Invalid username or password.");
      else if(error.response.status == 401)
        setError("Invalid OTP!");
      else
        setError("An error occurred during login: "+ error + ". Please Try Again!");

      setLoading(false)
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true)
    axios.post(loginUrl, {
      username,
      password,
    }).then(login_response => {
      if (login_response.status == 200) {
        const email_holder = login_response.data.user.email

        axios.post(generateOtp, {
          "email" : email_holder,
        }).then(generateOtp_response => {
        
          if (generateOtp_response.status == 200) {
            setUser(login_response.data.user);
            setEmail(login_response.data.user.email);
            setShowLogin(false);
            setError("");
          } else {
            setError("Failure to generate OTP! Please Try Again!");
          }

          setLoading(false)
        }).catch(error => {
          if(error.response.status == 404)
            setError("Invalid username or password.");
          else if(error.response.status == 500)
            setError("Failed to send OTP. Please Try Again!");
          else
            setError("An error occurred during login: "+ error + ". Please Try Again!");
          
          setLoading(false)
        });

      } else {
        setError("Invalid username or password.");
        setLoading(false)
      }

    }).catch(error => {
      if(error.response.status == 401)
        setError("Invalid username or password.");
      else
        setError("An error occurred during login: "+ error + ". Please Try Again!");
      
      setLoading(false)
    });
  };

  useEffect(() => {
    // console.log(getCookieValue('token'))
    if(getCookieValue('token')!=null && getCookieValue('token')!=undefined)
    {
      window.location.href = "/";
    }
  }, []);

  return (
    
    <div>
      {loading && <Loading />}
      {showLogin ? 
        <div className="container">
            <div className="card">
              <form onSubmit={handleSubmit} className="box">
                <h1>Login</h1>
                  <p className="ss">Please Enter your Password!</p>
                  <input type="text" name="" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                  <input type="password" name ="" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                  {error && <div style={{ color: 'red' }}>{error}</div>}
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
                  <button type="submit" disabled={!enableOtpButton}>Verify OTP</button>
              </form>
          </div>
        </div>
      }
    </div>
  );
}
