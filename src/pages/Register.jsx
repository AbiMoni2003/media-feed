import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");
    setError("");

    try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          email,
          password,
        });
  
        setMessage(response.data.message);
  
       
        setTimeout(() => {
          navigate("/home");
        }, 2000);
  
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <TextField 
        label="Email" 
        fullWidth 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        margin="normal"
      />

      <TextField
        label="Password"
        type={showPassword ? "password" : "text"} 
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />} 
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button 
        onClick={handleLogin} 
        variant="contained" 
        color="primary" 
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Register
      </Button>
    </Container>
  );
};

export default Login;
