import React from 'react';
import { Box, Card, TableBody, IconButton, Button, Table, TableRow, TableCell, Typography, TextField }from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import '../profile.css';
import { useNavigate, Link } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

const ProfileCard = ({ profileInformation, mode, setProfileInformation }) => {
  
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const [firstNameError, setFirstNameError] = useState('');  
  const [lastNameError, setLastNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password1Error, setPassword1Error] = useState('');
  const [password2Error, setPassword2Error] = useState('');

  // Catches if mode is not view or edit
  if (mode !== "view" && mode !== "edit") {
    return (
      <Card>
        <Box className="py-5 d-flex justify-content-center align-content-center">
          <Typography style={{ fontFamily: 'Oxygen' }}>
            Profile Card Error: Invalid Mode
          </Typography>
        </Box>
      </Card>
    )
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let info = {
      ...profileInformation,
      [name]: value
    };
    setProfileInformation(info);
  }
  const handleFirstNameChange = (e) => {
    let info = { ...profileInformation, first_name: e.target.value };
    if (info.first_name.length === 0) {
      setFirstNameError('First name is required');
    } else { 
      setFirstNameError('');
    }
    setProfileInformation(info);
  }

  const handleLastNameChange = (e) => {
    let info = { ...profileInformation, last_name: e.target.value };
    if (info.last_name.length === 0) {
      setLastNameError('Last name is required');
    } else {
      setLastNameError('');
    }
    setProfileInformation(info);
  };

  const handlePhoneChange = (e) => {
    let info = { ...profileInformation, phone: e.target.value };
    if (info.phone.length === 0) {
      setPhoneError('Phone number is required');
    } else {
      setPhoneError('');
    }
    setProfileInformation(info);
  };
  
  const handleEmailChange = (e) => {
    let info = { ...profileInformation, email: e.target.value };
    if (info.email.length === 0) {
      setEmailError('Email is required');
    } else {
      setEmailError('');
    }
    setProfileInformation(info);
  };

  const handlePassword1Change = (e) => {
    let info = { ...profileInformation, password1: e.target.value };
    setProfileInformation(info);
  };

  const handlePassword2Change = (e) => {
    let info = { ...profileInformation, password2: e.target.value };
    if (info.password1 && info.password1 != info.password2) {
      setPassword2Error('Passwords do not match');
    } else {
      setPassword2Error('');
    }
    setProfileInformation(info);
  };

  const handleSubmit = () => {
    if(mode === 'edit') {
      if (firstNameError || lastNameError || phoneError || emailError || password1Error || password2Error) {
        return;
      }
    }
    const formData = new FormData();
    if (selectedFile) {
      formData.append('avatar', selectedFile);
    }
    formData.append('first_name', profileInformation.first_name);
    formData.append('last_name', profileInformation.last_name);
    formData.append('phone_num', profileInformation.phone);
    formData.append('email', profileInformation.email);
    formData.append('password1', profileInformation.password1);
    formData.append('password2', profileInformation.password2);
    
    axios({
      method: 'post',
      url: 'http://localhost:8000/auth/editprofile/',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        navigate('/profile');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return ( 
    <Card 
    elevation={0}
    className='p-3'
    style={{
      // border: '1px solid lightgrey',
      backgroundColor: '#FCFCFC88'
      
  }}>
    <Box className="pt-3">
    <form onSubmit={handleSubmit}>
      <Box id="profile-information">
        <Box className='ms-5 text-uppercase'>
          {mode === 'edit' && 
            <div>
              <h1 style={{ textAlign: 'left' }}> Edit Profile </h1>
            </div>}
          {mode === 'view' && <h1 style={{ textAlign: 'left' }}> Profile Information</h1>}
          
        </Box>
        <Box className="d-flex">
          <Box className="d-flex align-items-center" 
            sx={{
              minWidth: 300,
              flexDirection: 'column',
            }}>
            {profileInformation.avatar ?
              <img 
                id="profilepic" 
                className="border-0" 
                src={profileInformation.avatar} 
                style={{ 
                  marginBottom: '15px',
                  objectFit: 'cover',
                  backgroundColor: '#F3C892',
                }}
                alt="Profile Picture"
              /> :
              <div
                id="profilepic"
                className="border-0"
                style={{
                  marginBottom: '15px',
                  objectFit: 'cover',
                  backgroundColor: '#F3C892',
                }}  
                />
            }
            
            {mode === 'edit' &&
              <Button
                aria-label="Upload Avatar"
                startIcon={<UploadIcon />}
                component="label"              
                style={{
                  fontFamily: 'Oxygen',
                  color: '#FFFFFF',
                  backgroundColor: '#F3C892',
                  fontWeight: 'bold',
                }}> 
                  Upload Avatar 
                  <input 
                    hidden 
                    accept="image/*" 
                    type="file" 
                    onChange={handleFileChange}
                  />
                </Button>
            }
            {selectedFile &&
              <div className="mt-2 w-100 d-flex align-items-center justify-content-center"
                style={{
                  overflow: 'hidden',
                }}>
                <p
                  className="p-0 m-0"
                  style={{

                    textOverflow: 'wrap',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}>
                  {selectedFile.name} 
                </p>
                <IconButton onClick={() => {setSelectedFile(null);}}>
                  <DeleteIcon />
                </IconButton>
              </div>
              }
          </Box>
          <Box className="ps-3 pt-3 w-100">
            
            { mode === 'view' &&  
              <h1 className="fw-bold" style={{ textAlign: 'left' }}>
                { profileInformation.name || ''}
              </h1> 
            }
            
            { mode === 'edit' && 
              <div className="m-0">
                <p className="text-uppercase text-body-secondary m-0 fw-bold">User Name</p>
                <div className="m-0"
                  style={{
                    height: '3.75rem',
                  }}>
                  <TextField 
                    className="w-75" 
                    variant='standard' 
                    margin='none' 
                    size='small'
                    label="First Name" 
                    name="first_name"
                    type="text"
                    required
                    error={!!firstNameError}
                    helperText={firstNameError ? firstNameError : ' '}
                    onChange={handleFirstNameChange}
                    sx={{
                      lineHeight: '0.8rem',
                      fontSize: '3rem',
                    }}
                    value={profileInformation.first_name || ''} />
                </div>
                <div className="mb-3"
                  style={{
                    height: '3.75rem',
                  }}>
                  <TextField 
                    className="w-75" 
                    variant='standard' 
                    margin='none' 
                    size='small' 
                    label="Last Name" 
                    name="last_name"
                    type="text"
                    required
                    error={!!lastNameError}
                    onChange={handleLastNameChange}
                    helperText={lastNameError ? lastNameError : ' '}
                    value={profileInformation.last_name || ''} />
                </div>
              </div>
            }

            <p className="text-uppercase text-body-secondary m-0 fw-bold">Contact Information</p>
            
            {/* View mode : Contact information  */}
            { mode === 'view' &&  
            <div>
              <p className="m-0">&nbsp;</p>
              <Table id="profile-contact-information" size='small'>
                <TableBody>
                  <TableRow>
                    <TableCell className="fw-bold">Email:</TableCell>
                    <TableCell className="text-body-tertiary">{ profileInformation.email || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="fw-bold">Phone:</TableCell>
                    <TableCell className="text-body-tertiary">{ profileInformation.phone_number || '-' }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          }

          { mode === 'edit' &&
            <div className='p-0 m-0'>
              <div style={{
                    height: '3.75rem',
                  }}>
                <TextField 
                  className="w-75" 
                  variant='standard' 
                  size='small' 
                  label="Email" 
                  name="email"
                  type="text"
                  required
                  error={!!emailError}
                  helperText={emailError ? emailError : ' '}
                  onChange={handleEmailChange}
                  value={profileInformation.email || ''} />
              </div>
              <div style={{
                    height: '3.75rem',
                  }}>
                <TextField 
                  className="w-75" 
                  variant='standard' 
                  size='small' 
                  label="Phone" 
                  name="phone_num"
                  type="text"
                  // required
                  // error={phoneError}
                  // helperText={phoneError ? phoneError : ' '}
                  onChange={handlePhoneChange}
                  value={profileInformation.phone || ''} />
              </div>
            </div>
          }

          {
            mode === 'edit' &&
            <div>
              <div style={{
                    height: '3.75rem',
                  }}>
                <TextField 
                  className="w-75" 
                  variant='standard' 
                  margin='none' 
                  size='small' 
                  label="Password" 
                  name="password1"
                  type="password"
                  error={!!password1Error}
                  onChange={handlePassword1Change}
                  helperText={password1Error ? password1Error : ' '}
                  value={profileInformation.password1 || ''} />
              </div>
              <div style={{
                    height: '3.75rem',
                  }}>
                <TextField 
                  className="w-75" 
                  variant='standard' 
                  margin='none' 
                  size='small' 
                  label="Repeat Password" 
                  name="password2"
                  type="password"
                  error={!!password2Error}
                  helperText={password2Error ? password2Error : ' '}
                  onChange={handlePassword2Change}
                  value={profileInformation.password2 || ''} />
              </div>
            </div>
          }
          </Box>
        </Box>
      </Box>
      <Box className="d-flex pt-1" style={{ justifyContent: 'flex-end' }}>
        { mode === 'view' && 
            <Link to="/edit-profile">
              <Button
                startIcon={<EditIcon />}           
                className="text-capitalize fw-light"
                style={{
                  fontFamily: 'Oxygen',
                  color: '#FFFFFF',
                  backgroundColor: '#F3C892',
                }}> 
              Edit Profile
              </Button>
            </Link>
        }
        

        { mode === 'edit' && 
            <Button
              className="text-capitalize fw-light"
              style={{
                fontFamily: 'Oxygen',
                color: '#FFFFFF',
                backgroundColor: '#F3C892',
              }}
              onClick={handleSubmit}
            >
              Submit Changes
            </Button>
        }
  
      </Box>
      { mode === 'view' && <hr className="w-100 mt-3" /> }
    </form>
    </Box>
  </Card>
   );
}
 
export default ProfileCard;