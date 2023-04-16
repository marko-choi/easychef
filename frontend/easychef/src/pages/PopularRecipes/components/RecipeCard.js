import { Autocomplete, Badge, Box, Button, Chip, Checkbox, Paper, IconButton, Tooltip, TextField } from "@mui/material";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import TimerIcon from '@mui/icons-material/Timer';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Carousel from 'react-material-ui-carousel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link } from 'react-router-dom';

const RecipeCard = ({
  recipe,
  index,
  popularDishes,
  setPopularDishes,
  isAuth,
  setRecipeLike,
  updateRecipeLikes,
  setRecipeRating,
  updateRecipeRating
}) => {
  return ( 
    <div className="popular-dish-card card mb-2 px-0" key={recipe.recipe_id}
      style={{ 
        paddingTop: '0rem',
      }}>
        { recipe.images.length !== 0 &&
          <Carousel
          height={400}
          fullHeightHover={false}
          navButtonsProps={{
            style: {
              backgroundColor: 'white',
              size: 'smaller',
              padding: '0px',
              color: 'grey',
            }
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
                color: '#EEE',
                padding: '0px',
            }
          }}
        >
          { recipe.images.length !== 0 && recipe.images.map((img, index) => (
              <Paper key={index} 
                className="d-flex justify-content-center align-items-center p-0 m-0"
                style={{
                  width: '100%',
                  height: '100%',  
                  overflow: 'hidden',
                  // background: '#FEFEFE'
                  background: 'black'
                }}>
                {/* make the image centered */}
                {img.slice(-3) === "mp4" ? (
                  <video
                    controls
                    src={img}
                    style={{
                      backgroundColor: "#808080",
                      width: "100%",
                    }}
                  />
                ) : (
                  <img src={img} alt={"Recipe Image " + index} 
                    className="popular-recipe-img"
                    style={{
                      backgroundColor: '#808080'
                    }}/>
                )}
              </Paper>
            ) 
          )}
        </Carousel>
        }
        {recipe.images.length === 0 && 
              <Paper
                elevation={0}
                className="d-flex border justify-content-center align-items-center p-0 m-0"
                style={{
                  width: '100%',
                  height: '400px',
                  overflow: 'hidden',
                  background: '#E6E6E6'
                }}>
                  <div>
                    No Recipe Image/Video Found

                  </div>
                </Paper>
        }
        <div className="card-body pb-1 px-3 pt-2">

          {/* <!-- Card details --> */}
          <div className="row m-0 p-0">
            <div className="p-0 mt-1">
              
              <Link 
                to={`/recipe-detail/${recipe.recipe_id}`} 
                className="popular-recipe-name p-0"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'instant'
                  });
                }}
                style={{
                  lineHeight: '1.4rem',
                  textDecoration: 'none',
                }}>
                <span className="m-0 p-0" 
                  style={{ 
                    fontSize: '1.4rem',
                    fontWeight: '400',
                    color: '#9D6743',
                    fontFamily: 'Noto Sans !important',
                    }} >
                    {/* {recipe.recipe_name} */}
                    {recipe.recipe_name}
                </span>
              </Link>
              <div className="popular-recipe-author p-0 mb-2"
                style={{
                  lineHeight: '1rem',
                }}>
              <span className="m-0 p-0" 
                style={{ 
                  lineHeight: '1rem',
                  color: 'grey',
                }}>
                  Author: {recipe.recipe_author}
              </span>
              </div>

            </div>
            <div className="row m-0 p-0">
              <div className="card-statistics p-0 col-12">
                <div className="row m-0 p-0">
                  {/* Column 1 that spans for 8 columns */}
                  <div className="col-8 p-0">
                    <div className="d-flex flex-row align-items-center">
                      <Tooltip disableInteractive arrow title={`Average Ratings (${recipe.ratings || 0 } stars)` } placement="bottom">
                        <ThumbUpIcon style={{ color: 'gray', marginRight: '3px', lineHeight: '0.8rem'}} />
                      </Tooltip>
                      <Rating
                        className="read-only-rating-buttons"
                        style={{ padding: '0px', lineHeight: '1.1rem' }}
                        name="read-only"
                        readOnly
                        emptyIcon={<StarIcon style={{color: '#D3D3D3'}} fontSize="inherit" />}
                        value={recipe.ratings}
                        precision={0.1}
                      />
                      
                    </div>
                    {/* Cuisines chips implemented with MUI */}
                    <div className="d-flex flex-row align-items-center mt-1"
                      style={{
                        overflow: 'hidden',
                      }}
                    >
                      <Tooltip disableInteractive arrow title="Cuisine(s)" placement="bottom">
                        <MenuBookIcon style={{ color: 'gray', marginRight: '3px'}} />
                      </Tooltip>
                      {recipe.cuisines.length !== 0 && 
                        recipe.cuisines instanceof Array
                        && recipe.cuisines.slice(0,3).map((cuisine, index) => (
                        <Chip
                          key={index}
                          label={cuisine[1]}
                          size="small"
                          style={{
                            backgroundColor: '#F5F5F5',
                            color: '#9D6743',
                            fontSize: '0.8rem',
                            padding: '0px 5px 0px 5px',
                            marginRight: '3px !important',
                          }}
                        />
                      ))}
                      {recipe.cuisines.length > 3 &&
                        <span>
                          &nbsp;...
                        </span>}
                    </div>
                      
                    {/* Diets chips implemented with MUI */}
                    <div className="d-flex flex-row align-items-center mt-1"
                      style={{
                        overflow: 'hidden',
                      }}>
                      <Tooltip disableInteractive arrow title="Diet(s)" placement="bottom">
                        <LocalDiningIcon style={{ color: 'gray', marginRight: '3px'}} />
                      </Tooltip>
                      {recipe.diets.length !== 0 
                        && recipe.diets instanceof Array
                        && recipe.diets.slice(0,3).map((diet, index) => (
                        <Chip
                          key={index}
                          label={diet[1]}
                          size="small"
                          style={{
                            backgroundColor: '#F5F5F5',
                            color: '#9D6743',
                            fontSize: '0.8rem',
                            padding: '0px 5px 0px 5px',
                            marginRight: '3px !important',
                          }}
                        />
                      ))}
                      {recipe.diets.length > 3 &&
                        <span>
                          &nbsp;...
                        </span>}
                    </div>
                  </div>

                  {/* Column 2 that spans for 4 columns */}
                  <div className="col-4 p-0">
                      {/* Total Likes  */}
                      <div className="d-flex flex-row align-items-center">
                        <Tooltip disableInteractive arrow title="Total Likes">
                          <FavoriteIcon className='' style={{ color: 'grey'}}/>
                        </Tooltip>
                        <span
                          className=''
                          style={{
                            lineHeight: '1.5rem',
                            color: 'grey',
                            fontSize: '0.8rem',
                            marginLeft: '3px'
                          }}>{ recipe.likes + ' likes' }</span>
                      </div>

                      <div className="d-flex flex-row align-items-center mt-1">
                        <Tooltip disableInteractive arrow title={"Cooking time (" + recipe.cooking_time + " minutes)"}>
                          <TimerIcon className='' style={{ color: 'grey'}}/>
                        </Tooltip>
                        <span
                          className=''
                          style={{
                            lineHeight: '1.5rem',
                            color: 'grey',
                            fontSize: '0.8rem',
                            marginLeft: '3px'
                          }}>{ recipe.cooking_time + ' mins'}</span>
                      </div>

                      <div className="d-flex flex-row align-items-center mt-1">
                        <Tooltip disableInteractive arrow title={"Preparation Time (" + recipe.prep_time + " minutes)"}>
                          <OutdoorGrillIcon className='' style={{ color: 'grey'}}/>
                        </Tooltip>
                        <span
                          className=''
                          style={{
                            lineHeight: '1.5rem',
                            color: 'grey',
                            fontSize: '0.8rem',
                            marginLeft: '3px'
                          }}>{ recipe.prep_time + ' mins'}</span>
                        </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* </a> */}

      <hr className="mt-2 mb-2 mx-2" />

      {/* <!-- Card Interactions --> */}
      <div className="card-interactions row px-3 m-0 p-0 pb-1">
        
        { isAuth &&
          <div className="m-0 p-0">
            <div className="d-flex justify-content-between">
              <div className="p-0 m-0 d-flex align-content-center">
                <span className="me-2 "
                  style={{
                    color: 'grey',
                    fontSize: '0.8rem',
                    lineHeight: '1.85rem',
                  }}>
                  Your Rating
                </span>
                {/* Rating buttons */}
                <Rating
                  style={{ padding: '0px', lineHeight: '1.7rem' }}
                  className="rating-buttons"
                  name={`rating-${recipe.recipe_id}`}
                  type="number"
                  value={recipe.rating ? recipe.rating : 0}
                  onChange={(event, newValue) => {
                    const updatedDishes = popularDishes.map((dish) => {
                      if (dish.recipe_id === recipe.recipe_id) {
                        dish.rating = newValue;

                        // update new rating in the database
                        if (dish.rating_status) {
                          updateRecipeRating(dish.recipe_id, newValue);
                        } else { // set new rating in the database
                          setRecipeRating(dish.recipe_id, newValue);
                        }
                      }
                      return dish;
                    });
                    setPopularDishes(updatedDishes);
                  }}
                />
              </div>
              <div>
                <Checkbox 
                  className='recipe-like-checkbox'
                  style={{ padding: '0px' }}
                  name={`like-${recipe.recipe_id}`}
                  icon={<FavoriteBorder />} 
                  checkedIcon={<FavoriteIcon color="warning" />} 
                  checked={recipe.like ? recipe.like : false}
                  type="checkbox"
                  onChange={(e) => {
                    const newPopularDishes = [...popularDishes];
                    newPopularDishes[index].like = e.target.checked ? true : false;

                    // Update new like status in the database
                    if (newPopularDishes[index].like_status) {
                      updateRecipeLikes(recipe.recipe_id, e.target.checked ? true : false);
                    } else {
                      setRecipeLike(recipe.recipe_id, e.target.checked ? true : false);
                    }
                    setPopularDishes(newPopularDishes);
                  }}
                />
              </div>
            </div>
          </div>
        }

        {recipe.comments && recipe.comments.slice(0,3).map((comment, index) => (
        <span className="m-0 p-0 text-truncate text-body-tertiary fw-light popular-recipe-comment" key={index}>
          <strong className="text-black fw-normal">{comment.user} </strong> 
            {comment.comment}
          </span>
        ))}
        <Link to="/recipe-detail/1" className="mt-2 p-0 mb-1"
          style={{
            color: '#c4a091',
            fontSize: '0.8rem',
            textDecoration: 'none',
            lineHeight: '0.85rem',
          }}
        >
          {'See all ' + recipe.comments.length + ' comment(s) →'}
        </Link>
        <span className='mt-0 p-0 mb-1'
          style={{
            fontSize: '0.8rem',
            lineHeight: '0.85rem',
            color: '#D3D3D3',
          }}>
          {new Date(recipe.date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          }).replace(',', '')}
        </span>
      </div>
    </div>
   );
}
 
export default RecipeCard;