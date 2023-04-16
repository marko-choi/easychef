import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@mui/material";

import axios from 'axios';
import {useNavigate} from 'react-router-dom';

import './style.css';


const Home = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();
  const [recipeQuery, setRecipeQuery] = useState('');

  const checkIsAuth = async () => {
    await axios.get('http://localhost:8000/auth/')
      .then((res) => {
        if (res.data.logged_in) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
    };

  const createRecipeBtn = () => {
    if (isAuth) { 
      navigate('/create-recipe');
    } else {
      navigate('/login');
    }
  };

  const viewDishesBtn = () => {
    if (recipeQuery === '') {
      navigate('/popular-recipes');
    } else {
      navigate(`/popular-recipes/${recipeQuery}`);
    }
  };

  useEffect(() => {
    checkIsAuth();
  }, []); 


  return (
    <div id='home-page'>
      {/* <!-- Hero Section --> */}
      <section className="hero">
        <div className="container">
          <div className="text d-flex row m-0 justify-content-center align-items-center">
            <div className="col-12 col-md-6">
              <div className="d-flex justify-content-center align-items-center">
                <div className="col-9 d-block d-md-none">
                  <img id="hero_pic" className="img-fluid" src="static/hero.png" alt="hero" />
                </div>
              </div>
              <div className="text-hero mb-3">
                Make Food Your Way
              </div>
              <div className="search mb-3">
                <input className="hero-search-input ps-2 py-1" type="text" label="Name" placeholder="Find Food Now" 
                  onChange={(e) => {
                    setRecipeQuery(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/popular-recipes/${recipeQuery}`)
                    }
                  }}
                  />
              </div>
              <div className="btns mb-3">
                <Button className="dishes-btn hero-btn" variant='text'
                  onClick={viewDishesBtn}
                >View Dishes</Button>
                <Button className="recipe-btn hero-btn" variant='text'
                  onClick={createRecipeBtn}
                >Create Your Own Recipes</Button>
              </div>
            </div>
            <div className="col-6 d-none d-md-block">
              <img id="hero_pic" className="img-fluid" src="static/hero.png" alt="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Main Content --> */}
      <section className="main-content">
        
      </section>  
    </div>  
  )
};
 
export default Home;