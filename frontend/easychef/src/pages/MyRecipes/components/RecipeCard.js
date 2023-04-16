import React from 'react';
import '../my-recipes.css';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import TimerIcon from '@mui/icons-material/Timer';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Tooltip, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { useState } from 'react';

const RecipeCard = ({ recipe }) => {
    const [cuisinesText, setCuisinesText] = useState("");
    let cuisines = recipe.cuisines;
    cuisines = cuisines.splice(',');
    let temp = "";
    if(cuisines.length > 1) {
        for(let i=0; i < cuisines.length; i++){
            temp += cuisines[i][0] + " ";
        }
        setCuisinesText(temp);
    }
    else if(cuisines.length === 1){
        setCuisinesText(cuisines[0][0]);
    }
    return (
        <div className="col-6 col-md-4 my-3">
            <div className="card card-icons">
                {/* <!-- Image --> */}
                <Link 
                to={`/recipe-detail/${recipe.recipe_id}`} 
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'instant'
                  });
                }}>
                { recipe.images.length !== 0 &&
                    <Carousel
                        height={300}
                        fullHeightHover={false}
                        indicatorContainerProps={{
                            style: {
                              zIndex: 1,
                              marginTop: "-30px",
                              position: "relative",
                              size: "smaller"
                            }
                          }}
                          indicatorIconButtonProps={{
                            style: {
                                padding: '10px', 
                                color: '#D3D3D3'
                            }
                          }}  
                          activeIndicatorIconButtonProps={{
                            style: {
                                color: '#EEE',
                                padding: '0px',
                            }
                          }}
                        zIndex={999}
                        >
                        {recipe.images.map((img, index) => (
                            <Paper key={index} 
                                className="d-flex justify-content-center align-items-center p-0 m-0"
                                style={{
                                width: '100%',
                                height: '300px',  
                                overflow: 'hidden',
                                }}>
                                {img.slice(-3) === "mp4" ? (
                                    <video
                                    src={"http://localhost:8000" + img}
                                    alt={img}
                                    style={{
                                        backgroundColor: "#808080",
                                        width: "100%",
                                    }}
                                    />
                                ) : (
                                <img
                                    src={"http://localhost:8000" + img}
                                    alt={img}
                                    style={{
                                    backgroundColor: "#808080",
                                    width: "100%",
                                    }}
                                />
                                )}
                            </Paper>
                            ) 
                        )}
                    </Carousel>
                }
                {recipe.images.length === 0 && 
                    <Paper
                    elevation={0}
                    className="d-flex border justify-content-center align-items-center p-0"
                    style={{
                    width: '100%',
                    height: '300px',
                    overflow: 'hidden',
                    background: '#E6E6E6',
                    marginBottom: '31px',
                    }}>
                        <div>
                            No Recipe Image/Video Found
                        </div>
                    </Paper>
                }
                <div style={{
                    height: '80px',
                }}>
                    <h2 className="card-title fs-4 m-0 mt-2">
                        <strong className="text-capitalize fw-normal" style={{
                            color: "#9D6743",
                            fontFamily: 'Oxygen',
                        }}>{recipe.recipe_name}</strong>
                    </h2>
                    <h3 className="fs-6 text-secondary fw-normal" 
                        style={{color: "#808080"}}>
                        Author: {recipe.recipe_author}
                    </h3>
                </div>
                
                {/* <!-- Content --> */}
                
                {/* <!-- Details --> */}
                <div className="card-body m-0 p-0">
                    {/* <div className="border" style={{ height: '60px', textOverflow: 'ellipsis'}}> */}
                        <p className="px-2 text-body-tertiary m-1 fw-light my-recipes-description"  
                            style={{
                                color: "#808080",
                                height: '65px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                lineHeight: '1.3rem',
                            }}>
                            {recipe.description}
                        </p>
                    {/* </div> */}
                    <div className="container m-0 p-0">
                    <hr className="p-0 m-3 mb-3"/>
                    </div>
                    <div className="row m-0 mb-2">
                        <div className="col-2 m-0 p-0 pb-1 card-icons">
                            <Tooltip disableInteractive arrow title="Cuisine(s)" placement="bottom">
                                <LocalDiningIcon style={{color: "#808080"}}/>
                            </Tooltip>

                            <p className="card-rating m-0" style={{color: "#808080"}}>{cuisinesText}</p>
                        </div>
                            
                        <div className="col-2 m-0 p-0 pb-1 card-icons">
                            <Tooltip disableInteractive arrow title={"Preparation Time (" + recipe.prep_time + " minutes)"}>
                                <TimerIcon style={{color: "#808080"}}/>
                            </Tooltip>
                            <p className="card-cuisine m-0" style={{color: "#808080"}}>{recipe.prep_time}m</p>
                        </div>

                        <div className="col-2 m-0 p-0 pb-1 icon-divider card-icons">
                            <Tooltip disableInteractive arrow title={"Cooking time (" + recipe.cooking_time + " minutes)"}>
                                <OutdoorGrillIcon style={{color: "#808080"}}/>
                            </Tooltip> 
                            <p className="card-cook-time m-0" style={{color: "#808080"}}>{recipe.cooking_time}m</p>
                        </div>

                        <div className="col-2 m-0 p-0 card-icons">
                            <Tooltip disableInteractive arrow title={`Average Ratings (${recipe.ratings || 0 } stars)` } placement="bottom">
                                <StarIcon style={{color: "#808080"}}/>
                            </Tooltip>
                            <p className="card-cook-time m-0" style={{color: "#808080"}}>{recipe.ratings ? Math.round(recipe.ratings * 100) / 100 : 0}</p>
                        </div>

                        <div className="col-2 m-0 p-0 card-icons">
                            <Tooltip disableInteractive arrow title="Total Likes">
                                <FavoriteIcon style={{color: "#808080"}}/>
                            </Tooltip>
                            <p className="card-cook-time m-0" style={{color: "#808080"}}>{recipe.likes}</p>
                        </div>

                        <div className="col-2 m-0 p-0 card-icons">
                            <Tooltip disableInteractive arrow title="Comments">
                                <CommentIcon style={{color: "#808080"}}/>
                            </Tooltip>
                            <p className="card-cook-time m-0" style={{color: "#808080"}}>{recipe.comments}</p>
                        </div>
                    </div>
                </div>
                </Link>
            </div>
        </div>
    );
};

export default RecipeCard;
