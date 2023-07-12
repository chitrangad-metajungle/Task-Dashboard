import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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
            {setAuth} && (
            <div>
                <p>"Email Sent"</p>
            </div>
            )<Link to="/register">Register</Link>
        </div>
    );
}
