import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
// import { useEffect } from 'react';
import './style.css';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const checkIsAuth = async () => {
    await axios.get('http://localhost:8000/auth/')
    .then((res) => {
      if (res.data.logged_in) { setIsAuth(true); } 
        else { setIsAuth(false); }
      })
    };
  checkIsAuth();

  const logout = async () => {
    await axios.get('http://localhost:8000/auth/logout/')
      .then((res) => {

        setIsAuth(false);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/');

      }).error((err) => {
        console.log(err);
      }
    );
  };

  return (   
    // <!-- Navigation Bar -->
    <nav className="navbar navbar-expand w-100 p-0">
      <div className="container h-100">
          <NavLink to='/' className="navbar-brand" activeclassname="active">
            <img id="logo" 
              style={{ 
                width: '4rem',
                height: '4rem',
                overflow: 'hidden',
               }}
              src="static/logo.png" alt=""/>
              <span style={{
                fontWeight: 'lighter',
                color: '#A06024',
              }}>
                Easy
              </span>
              <span className="fw-bold" style={{
                color: '#F49E62',
              }}>
                Chef
              </span>
          </NavLink>
          
          <ul className="navbar-nav d-flex align-items-center justify-content-end">

              <li className="nav-item d-flex justify-content-center"
                style={{
                  // width: '65px',
                }}>
                  <NavLink to="/" className="nav-link">Home</NavLink>
              </li>

              <li className="nav-item d-flex justify-content-center"
                style={{
                  // width: '170px',
                }}>
                  <NavLink to="/popular-recipes" className="nav-link">Popular Recipes</NavLink>
              </li>
              
              { isAuth &&
                <li className="nav-item d-flex justify-content-center" 
                  style={{ 
                    verticalAlign: 'middle',
                    // width: '135px',
                  }}>
                    <NavLink to="/my-recipes" className="nav-link">
                      My Recipes
                    </NavLink>
                </li>
              }
              
              { isAuth && 
              <li className="create-recipe pe-1" 
                style={{ 
                  backgroundColor: '#F49E62',
                  verticalAlign: 'middle',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '145px',
                  borderRadius: '5px',
                  // height: '1rem',
                  // padding: 0
                }}>
                <NavLink to="/create-recipe" 
                style={{
                  textDecoration: 'none',
                  color: 'white',
                }}>
                  <AddIcon /> Create Recipe
                </NavLink>
              </li>
              }

              { !isAuth &&
                <li className="d-flex justify-content-center"
                style={{
                  width: '65px',
                }}>
                  <NavLink to="/login" 
                    id="login-button"
                    className="nav-link rounded" 
                    style={{ 
                      backgroundColor: '#F49E62',
                      padding: '2px 8px',
                      color: 'white'
                      }}>
                    Login
                  </NavLink>
              </li>
              }
              
              { isAuth &&
              <IconButton
                id="fade-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                size='small'
                className='ms-2'
                style={{
                  padding: '5px',
                  // border: '1px red solid',
                  borderRadius: '0px',
                  height: '100%',
                }}
              >
                <MenuIcon />
              </IconButton>
              }
              { isAuth &&
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                elevation={2}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                style={{
                  padding: 0,
                  width: '180px',
                }}>
                  <NavLink to='/profile' 
                    className="active-dropdown" 
                    activeclassname="active">
                    <MenuItem onClick={handleClose}>
                      Profile
                    </MenuItem>
                  </NavLink>
                  <NavLink to='/shopping-cart' 
                    className="active-dropdown" 
                    activeclassname="active">
                    <MenuItem onClick={handleClose}>
                        Shopping Cart
                    </MenuItem>
                  </NavLink>
                  <NavLink to='/edit-profile' 
                    className="active-dropdown" 
                    activeclassname="active">
                    <MenuItem onClick={handleClose}>
                      Edit Profile
                    </MenuItem>
                  </NavLink>
                  <button onClick={logout} style={{ width: '100%', color: 'black', padding: 0, margin: 0, border: 0, backgroundColor: 'transparent'}}>
                    <MenuItem className="fw-normal" onClick={handleClose} >
                      <span style={{ fontFamily: 'Oxygen' }}>Logout</span></MenuItem>
                  </button>
              </Menu>}
            </ul>
      </div>
    </nav>
   );
}
 
export default Navbar;