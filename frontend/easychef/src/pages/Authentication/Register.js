import React, { useState } from "react";
import { Alert, AlertTitle, Button, Divider, TextField, IconButton } from "@mui/material";
// import { AccountCircle, Lock } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import './styles.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password2Error, setPassword2Error] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const[firstNameErrorText, setFirstNameErrorText] = useState("");
  const[lastNameErrorText, setLastNameErrorText] = useState("");
  const[usernameErrorText, setUsernameErrorText] = useState("");
  const[passwordErrorText, setPasswordErrorText] = useState("");
  const[password2ErrorText, setPassword2ErrorText] = useState("");
  const[emailErrorText, setEmailErrorText] = useState("");

  const [formError, setFormError] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!firstName) { 
      setFirstNameErrorText("This field is required.");
      setFirstNameError(true); 
    }
    if (!lastName) { 
      setLastNameErrorText("This field is required.");
      setLastNameError(true); 
    }
    if (!email) { 
      setEmailErrorText("This field is required.");
      setEmailError(true); 
    }
    if (!username) { 
      setUsernameErrorText("This field is required.");
      setUsernameError(true); 
    }
    if (!password) { 
      setPasswordErrorText("This field is required.");
      setPasswordError(true); 
    }
    if (!password2) { 
      setPassword2ErrorText("This field is required.");
      setPassword2Error(true); 
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password1', password);
    formData.append('password2', password2);
    formData.append('email', email);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);

    axios.post('http://127.0.0.1:8000/auth/signup/', formData)
    .then((res) => {
      console.log(res.data);
      // show success message
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);
      navigate('/login');
    })
    .catch((err) => {
      console.log(err.response.data.message);
      let errors = err.response.data.message;
      if (errors.username) {
        console.log('setting username error')
        setUsernameErrorText(errors.username[0]);
        setUsernameError(true);
      }
      if (errors.password1) {
        console.log('setting password error')
        setPasswordErrorText(errors.password1[0]);
        setPasswordError(true);
      }
      if (errors.password2) {
        console.log('setting password2 error')
        setPassword2ErrorText(errors.password2[0]);
        setPassword2Error(true);
      }
      if (errors.email) {
        console.log('setting email error')
        setEmailErrorText(errors.email[0]);
        setEmailError(true);
      }
      if (errors.first_name) {
        console.log('setting first name error')
        setFirstNameErrorText(errors.first_name[0]);
        setFirstNameError(true);
      }
      if (errors.last_name) {
        console.log('setting last name error')
        setLastNameErrorText(errors.last_name[0]);
        setLastNameError(true);
      }

      setFormError(true);
      setTimeout(() => {
        setFormError(false);
      }, 5000);
  
    })
  };
  

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    setFirstNameError(false);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    setLastNameError(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(false);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
  };
  
  const handlePassword2Change = (event) => {
    setPassword2(event.target.value);
    setPassword2Error(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="container mt-3">
      <div className="w-100 mt-3 d-flex justify-content-center align-items-center rounded"
        style={{
          // border: '1px solid red',
          backgroundColor: '#F8F9F955',
          minHeight: '75vh'
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
                    There are errors in your form. Please check and try again.
                  </div>
                  <div className="d-flex align-items-center ms-2">
                    <IconButton
                      className='alert-button p-3'
                      aria-label="close"
                      style={{
                        width: '1.4rem',
                      }} 
                      size="small"
                      onClick={ () => {setFormError(false);} }>
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              </Alert>}

              { formSuccess &&
              <Alert 
                style={{ 
                  position: 'absolute',
                  top: '8%',
                  left: '40',
                  alignContent: 'center',
                }}
                severity="success"
                elevation={1}>
                <div className="d-flex">
                  <div>
                    <AlertTitle>Success</AlertTitle>
                    You have successfully registered a new account!
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
        
        <div className="login-container p-5 py-4"
          style={{
            maxWidth: '500px',
          }}>
          <form onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}>
            <h2>Register</h2>
            <div className="form-group mt-4 d-flex">
              <TextField
                className="me-1"
                id="login-first-name-input"
                label="First Name"
                type="text"
                variant="outlined"
                value={firstName}
                fullWidth
                onChange={handleFirstNameChange}
                error={firstNameError}
                required
                helperText={firstNameError ? firstNameErrorText : ""}
                style={{
                  borderRadius: "5px",
                }}
              />
              <TextField
                className="ms-1"
                id="login-last-name-input"
                label="Last Name"
                type="text"
                variant="outlined"
                value={lastName}
                fullWidth
                onChange={handleLastNameChange}
                error={lastNameError}
                required
                helperText={lastNameError ? lastNameErrorText : ""}
                style={{
                  borderRadius: "5px",
                }}
              />
            </div>
            <div className="form-group">
              <TextField
                id="login-email-input"
                label="Email"
                type="text"
                variant="outlined"
                value={email}
                fullWidth
                onChange={handleEmailChange}
                error={emailError}
                required
                helperText={emailError ? emailErrorText : ""}
                style={{
                  borderRadius: "5px",
                }}
              />
            </div>
            <div className="form-group">
              <TextField
                id="login-username-input"
                label="Username"
                type="text"
                variant="outlined"
                value={username}
                fullWidth
                onChange={handleUsernameChange}
                error={usernameError}
                required
                helperText={usernameError ? usernameErrorText : ""}
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
                required
                value={password}
                fullWidth
                onChange={handlePasswordChange}
                error={passwordError}
                helperText={passwordError ? passwordErrorText : ""}
                style={{
                  borderRadius: "5px",
                }}
              />
            </div>
            <div className="form-group">
            <TextField
                id="login-repeat-password-input"
                label="Repeat Password"
                type="password"
                variant="outlined"
                required
                value={password2}
                fullWidth
                onChange={handlePassword2Change}
                error={password2Error}
                helperText={password2Error ? password2ErrorText : ""}
                style={{
                  borderRadius: "5px",
                }}
              />
            </div>
            <Button className="mt-4 text-capitalize" fullWidth variant="text" 
              onClick={handleSubmit}
              style={{
                fontFamily: 'Oxygen',
                fontWeight: 'bold',
                backgroundColor: "#E0915A",
                color: 'white'
              }}>
              Register
            </Button>
          </form>
          <Divider variant="middle" />
          <div className="text-center mt-3">
            <p>Have an account?
              <Link to="/login" style={{ color: "#E0915A" }}> Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;