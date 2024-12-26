


// LoginVariant2.jsx


import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import axios from 'axios'
const LoginVariant2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, { email, password });
      console.log('response from login',response.data.token);
      localStorage.setItem("authToken", response.data.token);
      alert(response.data.message);

      login(response.data.token);
      navigate("/upload", { state: { ...response.data } });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  return (
    <Container maxWidth="xs">
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        backgroundColor: "linear-gradient(to right, #6a11cb, #2575fc)",
        borderRadius: 3,
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
        mt: 5,
      }}
    >
      <Typography variant="h3" sx={{ marginBottom: 3, color: "#fff", textAlign: "center" }}>
        Welcome Back
      </Typography>
  
      <TextField
        label="Email"
        variant="filled"
        value={email}
        onChange={handleEmailChange}
        required
        fullWidth
        error={!isEmailValid && email.length > 0}
        helperText={!isEmailValid && email.length > 0 ? "Invalid email address" : ""}
        sx={{
          marginBottom: 3,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 2,
          "& input": {
            color: "#333",
          },
        }}
      />
  
      <TextField
        label="Password"
        type="password"
        variant="filled"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        sx={{
          marginBottom: 3,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 2,
          "& input": {
            color: "#333",
          },
        }}
      />
  
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          padding: "12px",
          fontSize: "16px",
          backgroundColor: "#5e72e4",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#4361ee",
          },
        }}
      >
        Sign In
      </Button>
    </Box>
  </Container>
  
  );
};

export default LoginVariant2;
