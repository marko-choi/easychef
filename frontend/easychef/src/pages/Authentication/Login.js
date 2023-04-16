import React, { useState } from "react";
import { Alert, AlertTitle, IconButton, Button, Divider, TextField } from "@mui/material";
// import { AccountCircle, Lock } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from "react-router-dom";


import './styles.css';
import axios from 'axios';

const Login = ({isAuth, setIsAuth}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(false);
  
  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    
    if (!username) { 
      setUsernameError(true); 
    }
    if (!password) { 
      setPasswordError(true); 
    }

    if (!username || !password) { 
      setIsLoading(false);
      return;
    }
    

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
  
    await axios.post('http://127.0.0.1:8000/auth/login/', {
      username: username,
      password: password
    })
      .then((response) => {
        setIsLoading(false);
        // store token in local storage and redirect to home page
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
        setIsAuth(true);
        navigate('/');
      })
      .catch((error) => {
        setIsLoading(false);
        if (username && password) {
          setFormError(true);
          setTimeout(() => {
            setFormError(false);
          }
          , 5000);
        }
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
  };


  return (
    <div className="container d-flex justify-content-center align-items-center"
      style={{
        minHeight: '90vh',
      }}>
      <div className="w-100 d-flex justify-content-center align-items-center rounded"
        style={{
          // border: '1px solid red',
          backgroundColor: '#F8F9F955',
          maxHeight: '70vh',
          maxWidth: '760px'
        }}>
           { formError &&
              <Alert 
                style={{ 
                  position: 'absolute',
                  top: '8%',
                  left: '40',
                  alignContent: 'center',
                }}
                severity="error"
                elevation={1}>
                <div className="d-flex">
                  <div>
                    <AlertTitle>Error</AlertTitle>
                    Invalid credentials. Please try again.
                  </div>
                  <IconButton
                    aria-label="close"
                    style={{
                      width: '3rem',
                      padding: 0,
                    }} 
                    size="small"
                    onClick={ () => {setFormError(false);} }>
                    <CloseIcon />
                  </IconButton>
                </div>
              </Alert>}
        <div className="login-container w-75 p-5">
          <form onSubmit={handleSubmit} 
            onKeyDown={handleKeyDown}>
            <h2>Login</h2>
            <div className="form-group mt-4">
              <TextField
                id="login-username-input"
                label="Username"
                type="text"
                variant="outlined"
                value={username}
                fullWidth
                onChange={handleUsernameChange}
                error={usernameError}
                helperText={usernameError ? "Username is required" : ""}
                style={{
                  borderRadius: "5px",
                }}
              />
            </div>
            <div className="form-group">
            <TextField
                id="login-password-input"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                fullWidth
                onChange={handlePasswordChange}
                error={passwordError}
                helperText={passwordError ? "Password is required" : ""}
                style={{
                  borderRadius: "5px",
                }}
              />
            </div>
            { !isLoading ?

            <Button className="mt-5 text-capitalize" fullWidth variant="text" 
              onClick={handleSubmit}
              style={{
                fontFamily: 'Oxygen',
                fontWeight: 'bold',
                backgroundColor: "#E0915A",
                color: 'white'
              }}>
              Login
            </Button> 
            : 
            <Button className="mt-5 text-capitalize" fullWidth variant="text" 
            onClick={handleSubmit}
            disabled
            style={{
              fontFamily: 'Oxygen',
              fontWeight: 'bold',
              backgroundColor: "#E0915A",
              color: 'white'
            }}>
              <div className="spinner-border text-light" role="status"> 
              </div>
            </Button>
            }

          </form>
          <Divider variant="middle" />
          <div className="text-center mt-3">
            <p>Don't have an account? 
              <Link to="/register" style={{ color: "#E0915A" }}> Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;