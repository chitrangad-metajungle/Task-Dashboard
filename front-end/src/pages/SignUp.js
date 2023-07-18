import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles.css"
import {setCookie, getCookieValue} from "../Utility/token_functions"
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

import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function Login(params) {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#18a27a',
        darker: '#053e85',
      }
    },
  });
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [registerSuccessful, setRegisterSuccessful] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const signupUrl = "http://127.0.0.1:10000/auth/register";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true)
    axios.post(signupUrl, {
      username,
      email,
      password,
    }).then(signup_response => {
      if (signup_response.status == 201) {
        setRegisterSuccessful(true)
        setLoading(false)
      } else {
        setError("Registration failed!");
        setLoading(false)
      }

    }).catch(error => {
        console.log(error);
      if(error!=undefined && error.response!=undefined && error.response.data !=undefined && error.response.data.error !=undefined)
        setError("Registration failed!"+ error.response.data.error + ". Please Try Again!");
      else
        setError("Registration failed: "+ error + ". Please Try Again!");
      
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
      <ThemeProvider theme={theme}>
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
              Register
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
                  id="email"
                  label="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
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
              {registerSuccessful && <div style={{ color: 'Blue' }}>{"User Registered successfully. Please Sign In!"}</div>}
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
                  Sign Up
              </Button>
              <Grid container>
                  <Grid item>
                  <Link href="/login" variant="body2">
                      {"Already have an account? Sign In"}
                  </Link>
                  </Grid>
              </Grid>
              </Box>
            </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
