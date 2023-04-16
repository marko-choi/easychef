import React, { useEffect, useState } from "react";
import "./recipe-details.css";
import axios from "axios";
import {
  Button,
  Checkbox,
  IconButton,
  Paper,
  Tooltip,
  Chip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TimerIcon from "@mui/icons-material/Timer";
import KebabDiningIcon from "@mui/icons-material/KebabDining";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import Carousel from "react-material-ui-carousel";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import DifferenceIcon from '@mui/icons-material/Difference';

import { Link, useNavigate } from "react-router-dom";

import CommentUpload from "./components/CommentUpload";
import Comment from "./components/Comment";
import ShoppingCart from "./components/shoppingcart";

const RecipeDetails = ({isAuth}) => {
  const navigate = useNavigate();
  const [recipeId, setRecipeId] = useState(-1);
  const [recipeName, setRecipeName] = useState("");
  const [author, setAuthor] = useState("");
  const [cookingTime, setCookingTime] = useState(0);
  const [prepTime, setPrepTime] = useState(0);
  const [servings, setServings] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstruction] = useState([]);
  const [diet, setDiet] = useState([]);
  const [cuisine, setCuisine] = useState([]);
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [cartServings, setCartServings] = useState(1);
  const [comments, setComment] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [haveLiked, sethaveLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [avgrating, setavgRating] = useState(0);
  const [rating, setRating] = useState(false);
  const [haveRated, setHaveRated] = useState(false);
  const [baseRecipe, setBaseRecipe] = useState("");
  const [baseRecipeId, setBaseRecipeId] = useState(-1);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    const recipe_id = window.location.pathname.split("/")[2];
    async function fetch_data(recipe_id) {
      await axios
        .get(`http://localhost:8000/recipe/recipe-detail/${recipe_id}/`)
        .then((res) => {
          setRecipeId(res.data.recipe_id);
          setRecipeName(res.data.recipe_name);
          setCookingTime(res.data.cooking_time);
          setPrepTime(res.data.preparation_time);
          setServings(res.data.serving);
          setIngredients(res.data.ingredients);
          setInstruction(res.data.steps);
          setIsLiked(res.data.liked);
          setDiet(res.data.diet);
          setCuisine(res.data.cuisine);
          let date = res.data.date;
          date = date.split("T")[0];
          setDate(date);
          setAuthor(res.data.author);
          setImages(res.data.images);
          setComment(res.data.comments);
          setIsOwner(res.data.is_owner);
          setavgRating(res.data.average_rating);
          setBaseRecipe(res.data.base_recipe);
          setBaseRecipeId(res.data.base_recipe_id);
          setTotalLikes(res.data.total_likes);
        })
        .catch((err) => {
        });
      await axios
        .get(`http://localhost:8000/social/recipe-rating/${recipe_id}/`)
        .then((res) => {
          if(res.data.rating !== null){
            setHaveRated(true);
            setRating(res.data.rating);
          }
        })
        .catch((err) => {
        });
      await axios
        .get(`http://localhost:8000/social/recipe-favorite/${recipe_id}/`)
        .then((res) => {
          if(res.data.like !== null){
            sethaveLiked(true);
            setIsLiked(res.data.like);
          }
        })
        .catch((err) => {
        });
    }
    fetch_data(recipe_id);
  }, [rating, recipeId]);

  function expandCurrentDiet(diet) {
    if (diet === "V") {
      return "Vegetarian";
    } else if (diet === "VG") {
      return "Vegan";
    } else if (diet === "GF") {
      return "Gluten Free";
    } else if (diet === "DF") {
      return "Dairy Free";
    } else if (diet === "O") {
      return "Other";
    }
  }

  function expandCurrentCuisine(cuisine) {
    if (cuisine === "A") {
      return "American";
    } else if (cuisine === "B") {
      return "Brazilian";
    } else if (cuisine === "C") {
      return "Chinese";
    } else if (cuisine === "K") {
      return "Korean";
    } else if (cuisine === "J") {
      return "Japanese";
    } else if (cuisine === "O") {
      return "Other";
    }
  }

  function updatelike(isLiked){
    const formData = new FormData();
    formData.append("like", isLiked);
    let method = "";
    let url = "";
    if (haveLiked){
      method = "patch";
      url = "http://localhost:8000/social/recipe-favorite/" + recipeId + "/";
    }
    else{
      method = "post";
      url = "http://localhost:8000/social/recipe-favorite/";
      formData.append("recipe_id", recipeId);
    }
    axios({
      method: method,
      url: url,
      data: formData,
    })
      .then((response) => {
        sethaveLiked(true);
        setIsLiked(isLiked);
      });
    axios({
      method: "get",
      url: "http://localhost:8000/recipe/recipe-detail/" + recipeId + "/",
    })
      .then((response) => {
        setTotalLikes(response.data.total_likes);
      });
  }

  function updateRating(rating){
    const formData = new FormData();
    formData.append("rating", rating);
    let method = "";
    let url = "";
    if (haveRated){
      method = "patch";
      url = "http://localhost:8000/social/recipe-rating/" + recipeId + "/";
    }
    else{
      method = "post";
      url = "http://localhost:8000/social/recipe-rating/";
      formData.append("recipe_id", recipeId);
    }
    axios({
      method: method,
      url: url,
      data: formData,
    })
      .then((response) => {
        setHaveRated(true);
        setRating(rating);
      }
      )
      .catch((error) => {
      }); 
  }

  function handleDelete(){
    axios.delete(`http://localhost:8000/recipe/recipe-edit/${recipeId}/`)
    .then((res) => {
      navigate("/my-recipes");
    })
    .catch((err) => {
    });
  }

  return (
    <div className="recipe-details">
      {isAuth &&
      <ShoppingCart shoppingList={shoppingList} setShoppingList={setShoppingList} recipeName={recipeName} recipeId={recipeId} cartServings={cartServings} setCartServings={setCartServings} ingredients={ingredients}/>
      }

      {/* <!-- Main Content --> */}
      <div className="container mx-auto p-0 m-0">
        <div className="row m-0 mt-3">
          <div className="col-0 col-md-1 "></div>
          <div className="col-12 col-md-10 justify-content-center">
            {/* <!-- Title --> */}
            <div className="container text-center" id="recipe-title">
              <h1 className="text-center text-capitalize">{recipeName}</h1>
              <h2 className="text-body-secondary fs-5">{author}</h2>
              <h3 className="text-body-tertiary fs-6">{date}</h3>
            </div>

            <div className="container">
              <hr className="mx-3 mt-2" />
            </div>

            {/* Display ALL RECIPE IMAGES.*/}
            {images.length !== 0 && (
              <div className="container mt-3 mb-3">
                <Carousel
                  height={300}
                  fullHeightHover={false}
                  navButtonsProps={{
                    style: {
                      backgroundColor: "white",
                      size: "smaller",
                      padding: "0px",
                      color: "grey",
                    },
                  }}
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
                        padding: '10px',    // 1
                        color: '#D3D3D3'       // 3
                    }
                  }}  
                  activeIndicatorIconButtonProps={{
                    style: {
                        color: 'white',
                        padding: '0px',
                    }
                  }}
                >
                  {images.map((image, index) => (
                    <Paper
                      key={index}
                      className="d-flex justify-content-center align-items-center p-0 m-0"
                      style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        background: "#FEFEFE",
                      }}
                    >
                      {image.slice(-3) === "mp4" ? (
                        <video
                          controls
                          src={"http://localhost:8000" + image}
                          alt={recipeName + index}
                          style={{
                            backgroundColor: "black",
                            width: "100%",
                          }}
                        />
                      ) : (
                      <img
                        src={"http://localhost:8000" + image}
                        alt={recipeName + index}
                        style={{
                          backgroundColor: "black",
                          width: "100%",
                        }}
                      />
                      )}
                    </Paper>
                  ))}
                </Carousel>
              </div>
            )}
            {images.length === 0 && 
              <div className="container mt-3 mb-3 d-flex" style={{ height: '300px', alignItems:'center', justifyContent:'center' }}>
                <strong>No images/video available.</strong>
              </div>
            }

            {/* <!-- Content --> */}
            <div className="container">
              <div className="container">
                {/* Separate user and existing rating system */}
                <div className="d-flex flex-row m-0 p-0"
                  style={{
                    height: "22px",
                  }}>
                  <div className="col-6 d-flex flex-row align-items-center m-0 p-0">
                    <strong className="text-uppercase">Average Rating</strong>
                    <Rating
                        className="read-only-rating-buttons ps-2 py-2 mb-0"
                        style={{ 
                          marginBottom: "8px",
                        }}
                        name="read-only"
                        readOnly
                        emptyIcon={<StarIcon style={{color: '#D3D3D3'}} fontSize="auto" />}
                        value={avgrating}
                        precision={0.1}
                      />
                    <strong className="text-uppercase" style={{marginLeft: '20px'}}>Total Likes: {totalLikes}</strong>
                  </div>
                  {isAuth && 
                  <div className="d-flex col-6 justify-content-end align-items-center m-0 p-0">
                    <Checkbox
                      className="recipe-like-checkbox recipe-detail-buttons"
                      style={{ padding: "0px" }}
                      name={`like-${recipeId}`}
                      icon={<FavoriteBorderIcon />}
                      checkedIcon={<FavoriteIcon color="warning" />}
                      checked={isLiked}
                      type="checkbox"
                      onChange={(e) => {
                        updatelike(e.target.checked);
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => navigate("/build-on-recipe/" + recipeId)}
                      className="bg-warning mx-2 recipe-detail-buttons"
                      size="small"
                      disableElevation
                    >
                      Build upon recipe
                    </Button>
                    {isOwner &&
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate("/edit-my-recipe/" + recipeId)}
                      className="mx-2 recipe-detail-buttons"
                      disableElevation
                    >
                      Edit your recipe
                    </Button>}
                    { isOwner &&
                      <IconButton title="delete recipe" className="recipe-detail-buttons" onClick={handleDelete}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  </div>}
                </div>

                
                {isAuth && 
                  <div className="d-flex flex-row mb-1">
                    <h6 className="text-uppercase fw-bold m-0 align-item-center pt-1">
                      Your Rating
                    </h6>
                    <Rating
                      style={{ marginLeft: "34px"}}
                      className="rating-buttons"
                      name={`rating-${recipeId}`}
                      type="number"
                      value={rating ? rating : 0}
                      onChange={(e, newvalue) => {
                        updateRating(newvalue);
                      }}
                    />
                  </div>
                }

                <div className="dish-information">
                  <h6 className="text-uppercase fw-bold w-100">
                    Dish Information
                  </h6>
                  <div className="row" style={{ margin: "auto" }}>
                    <div className="main-details-divider w-100">&#8203;</div>
                    <div className="main-details pt-2 pb-3">
                      <div className="table-responsive">
                        <table id="dish-information-table">
                          <tbody>
                            <tr>
                              <td scope="row">
                                <Tooltip>
                                  <DinnerDiningIcon />
                                </Tooltip>
                                <strong>Diets</strong> <br />
                              </td>
                              <td style={{ overflow:"hidden" }}>
                              {diet.map(
                                (diet) => (
                                  (diet = expandCurrentDiet(diet)),
                                  (<Chip key={diet} label={diet} style={{marginRight: "10px"}}></Chip>)
                                )
                              )}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                <Tooltip>
                                  <RestaurantIcon />
                                </Tooltip>
                                <strong>Cuisine</strong>
                              </td>
                              <td style={{ overflow:"hidden" }}>
                              {cuisine.map(
                                (cuisine) => (
                                  (cuisine = expandCurrentCuisine(cuisine)),
                                  (<Chip key={cuisine} label={cuisine} style={{marginRight: "10px"}}></Chip>)
                                )
                              )}
                              </td>
                            </tr>
                            <tr>
                              <td scope="row">
                                <Tooltip>
                                  <TimerIcon />
                                </Tooltip>
                                <strong>Preparation Time</strong>
                              </td>
                              <td>{prepTime} minutes</td>
                            </tr>
                            <tr>
                              <td scope="row">
                                <Tooltip>
                                  <TimerIcon />
                                </Tooltip>
                                <strong>Cooking Time</strong>
                              </td>
                              <td>{cookingTime} minutes</td>
                            </tr>
                            <tr>
                              <td scope="row">
                                <Tooltip>
                                  <LocalDiningIcon />
                                </Tooltip>
                                <strong>Servings</strong>
                              </td>
                              <td>{servings} Serving</td>
                            </tr>
                            {baseRecipe !== null &&
                              <tr>
                                <td scope="row">
                                  <Tooltip>
                                    <DifferenceIcon />
                                  </Tooltip>
                                  <strong>Base Recipe</strong>
                                </td>
                                <td>
                                  <Link to={"/recipe-detail/" + baseRecipeId} onClick={() => {
                                    window.scrollTo({
                                      top: 0,
                                      behavior: 'instant'
                                    });
                                    setRecipeId(baseRecipeId)}}> 
                                  <div style={{color:'black'}}>{baseRecipe}</div>
                                  </Link>
                                </td>
                              </tr>
                              
                            } 
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="ingredients-divider w-100 mt-3">
                      &#8203;
                    </div>
                    <div className="ingredients-information">
                      <div className="subheading">
                        <Tooltip>
                          <KebabDiningIcon />
                        </Tooltip>
                        <strong className="text-uppercase">Ingredients</strong>
                      </div>

                      <hr />

                      <div className="row" style={{ margin: "auto" }}>
                        <div className="col">
                          <ul>
                            {ingredients.map(
                              ({ ingredients_name, quantity }) => (
                                <li key={ingredients_name}>
                                  {quantity} {ingredients_name}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Create separate ingredient components */}
                    <div className="instruction-divider w-100 mt-3">
                      &#8203;
                    </div>
                    <div className="instruction-information">
                      <div className="subheading">
                        <Tooltip>
                          <MenuBookIcon />
                        </Tooltip>
                        <strong className="text-uppercase">
                          {" "}
                          Instructions
                        </strong>
                      </div>

                      <div className="instructions">
                        {instructions.map(
                          ({ instruction, step_number, time }, index) => (
                            //should turn this into a component
                            <div
                              className="row m-0 mb-2 step align-items-center py-3"
                              key={step_number}
                              style={{ backgroundColor: "#EACBCB" }}
                            >
                              <div className="col-1 step-num">
                                {step_number}
                              </div>
                              <div className="col-11 step-content ps-4">
                                {instruction}
                                <br />
                                <Tooltip>
                                  <TimerIcon />
                                </Tooltip>
                                Time: {time} minutes
                              </div>
                              {instructions[index].images.length !== 0 && (
                                <Carousel
                                  interval={null}
                                  className="mx-0 my-3"
                                  height={300}
                                  fullHeightHover={false}
                                  navButtonsProps={{
                                    style: {
                                      backgroundColor: "white",
                                      size: "smaller",
                                      padding: "0px",
                                      color: "grey",
                                    },
                                  }}
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
                                >
                                  {instructions[index].images.map(
                                    (image, index) => (
                                      <Paper
                                        key={index}
                                        className="d-flex justify-content-center align-items-center p-0 m-0"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          overflow: "hidden",
                                          background: "#FEFEFE",
                                        }}
                                      >
                                        <img
                                          src={"http://localhost:8000" + image}
                                          alt={recipeName + index}
                                          style={{
                                            backgroundColor: "black",
                                            width: "100%",
                                          }}
                                        />
                                      </Paper>
                                    )
                                  )}
                                </Carousel>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="comment-section mx-auto">
        <div className="container mx-auto p-0 m-0">
          <div className="row pt-5 mt-5 mx-auto">
            <div className="col-12 col-lg-10 pe-0 mx-auto">
              <div className="comments p-5 rounded-4 mx-auto">
                <h2 className="title">Comments</h2>
                <div className="row mt-0">
                  {comments.map((comment, index) => (
                    <Comment key={comment + index} comment={comment} />
                  ))}
                  {comments.length === 0 && <h5 style={{ textAlign: "center", marginTop: "20px" }}>No Comments Yet</h5>}
                </div>
              </div>
              {isAuth &&
                <CommentUpload
                  recipeId={recipeId}
                  statesetComments={setComment}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default RecipeDetails;
