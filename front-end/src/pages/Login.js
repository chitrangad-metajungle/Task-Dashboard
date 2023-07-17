import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles.css"
import {setCookie, setObjectCookie} from "../Utility/token_functions"
import Loading from "../components/Loading";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

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
        setObjectCookie("user", generateOtp_response.data.user, 1);
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
    // if(getCookieValue('token')!=null && getCookieValue('token')!=undefined)
    // {
    //   window.location.href = "/";
    // }
  }, []);

  return (
    
    <div>
      {loading && <Loading />}
      {showLogin ? 
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              px: 4,
              py: 6,
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
        :
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              px: 4,
              py: 6,
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
            OTP Verification
            </Typography>
            <Box component="form" onSubmit={handleSubmitOtp} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="OTP"
                name="otp"
                autoComplete="otp"
                autoFocus
                value={otp} 
                onChange={handleOtpChange}
              />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!enableOtpButton}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      }
    </div>
  );
}
