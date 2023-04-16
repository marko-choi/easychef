import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress } from "@mui/material";

import TablePagination from '@mui/material/TablePagination';

import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import FilterForm from './components/FilterForm';
import RecipeCard from './components/RecipeCard';
import SkeletonRecipeCard from './components/SkeletonRecipeCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollTopButton from '../../components/ScrollTopButton';

const PopularRecipes = ({ isAuth, setIsAuth }) => {
  
  const navigate = useNavigate();
  const { query } = useParams();
  const [queryStatus, setQueryStatus] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '',
    author: '',
    ingredient: ''
  });
  const [formDataChanged, setFormDataChanged] = useState(false);
  const [filtersList, setFiltersList] = useState({ cuisines: [], diets: [], cookingTime: []});
  const [ingredientAutoList, setIngredientAutoList] = useState([]);
  const [totalNumberOfRecipes, setTotalNumberOfRecipes] = useState(0);

  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoadingPopularDishes, setIsLoadingPopularDishes] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [setResetted, setSetResetted] = useState(false);

  const getIngredientLabel = (ingredient) => {
    // console.log(ingredient, formData.ingredients)
    if (ingredient) {
      return ingredient;
    }
    return '';
  }

  // Handles form data changes
  const handleFormChange = (event) => { 
    let {name, value} = event.target;

    if (event.target.id.includes('search-ingredient')) {
      name = 'ingredient';
      value = event.target.innerText;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    setFormDataChanged(true);
  };

  const handleIngredientChange = (event,value) => {
    // console.log("handle ingredient change", value)
    if (value === null || value === undefined) {
      setFormData((prevFormData) => ({ ...prevFormData, ingredient: '' }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, ingredient: value }));
    }
    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   ingredient: value
    // }));
    // console.log(value)
    setFormDataChanged(true);
  };
  
  const [numSort, setNumSort] = useState(0);
  const [sort, setSort] = useState([
    { value: 'avg_ratings', name: 'Overall Rating', order: '', priority: 0, active: false},
    { value: 'likes', name: 'Most Favorited', order: '', priority: 0, active: false},
    { value: 'prep_time', name: 'Preparation Time', order: '', priority: 0, active: false},
    { value: 'cooking_time', name: 'Cooking Time', order: '', priority: 0, active: false},
  ]);
  const [sorted, setSorted] = useState(false);

  const [popularDishes, setPopularDishes] = useState([]);
  function handleChange(newCuisineFilters, type) {
    if (type === 'cuisine') {
      setFiltersList({
        ...filtersList,
        cuisines: newCuisineFilters
      });
      setFormDataChanged(true);
    }
    if (type === 'diet') {
      setFiltersList({
        ...filtersList,
        diets: newCuisineFilters
      });
      setFormDataChanged(true);
    }
    if (type === 'cookingTime') {
      setFiltersList({
        ...filtersList,
        cookingTime: newCuisineFilters
      });
      setFormDataChanged(true);
    }
  }
  
  const resetFields = () => {
    // console.log("resetting fields", formData)
    let original = {
      name: '',
      author: '',
      ingredient: '',
    }
    setFormData(original);
    getIngredientLabel('')

    let newList = filtersList;
    newList.cuisines.forEach((item) => {
      item.checked = false;
    });
    newList.diets.forEach((item) => {
      item.checked = false;
    });
    newList.cookingTime.forEach((item) => {
      item.checked = false;
    });
    setFiltersList(newList);
    setResetForm(true);
    setPage(0);
  }

  function getSortTooltip(name) {
    let order = sort.find((item) => item.name === name).order;
    if (order === 'asc') {
      return 'Sort by ' + name + ' (ascending)';
    } else if (order === 'desc') {
      return 'Sort by ' + name + ' (descending)';
    }
    return 'Sort by ' + name + ' (no order)';

  }

  const sortAscend = async (name) => {
    let newSort = sort.map((item) => {
      if (item.name === name) {
        let priority = numSort + 1;
        setNumSort(numSort + 1);
        return {
          ...item,
          order: 'asc',
          active: true,
          priority
        }
      } else {
        return {
          ...item
        }
      }
    });
    setSort(newSort);
    setSorted(true);
  }

  const sortDescend = async (name) => {
    let newSort = sort.map((item) => {
      if (item.name === name) {
        return {
          ...item,
          order: 'desc',
          active: true,
        }
      } else {
        return {
          ...item
        }
      }
    });
    setSort(newSort);
    setSorted(true);
  }

  const sortClear = async (name) => {
    
    var oldPriority = 0;
    let newSort = sort.map((item) => {
      if (item.name === name) {
        oldPriority = item.priority;
        return {
          ...item,
          order: '',
          active: false,
          priority: 0
        }
      } else {
        return item;
      }
    });
    newSort = newSort.map((item) => {
      if (item.priority > oldPriority) {
        return {
          ...item,
          priority: item.priority - 1
        }
      } else {
        return item;
      }
    });
    setNumSort(numSort - 1);
    setSort(newSort);
    setSorted(true);
  }

  // Acquires the list of possible filters from the backend
  const getFilters = async () => {
    await axios.get('http://localhost:8000/search/recipe-filter/')
    .then((res) => {

      let data = res.data;
      data.cuisines = data.cuisines.map((item) => {
        return {
          name: item.label,
          value: item.value,
          checked: false,
          amount: item.amount
        }
      });
      data.diets = data.diets.map((item) => {
        return {
          name: item.label,
          value: item.value,
          checked: false,
          amount: item.amount
        }
      });
      data.cookingTime = data.cooking_time.map((item) => {
        return {
          name: item.label,
          value: item.value,
          checked: false,
          amount: item.amount
        }
      });
      setFiltersList(data);
    })
    .catch((err) => {
      // console.log(err.message);
    });
  };

  // Acquires the ingredient autocomplete list from the backend
  const getFilterAutoComplete = async (event, value, reason) => {
    // setIngredientFilter(value);
    if (reason === 'input') {
      // console.log(value)
      let payload = { ingredient: value };
      await axios.post('http://localhost:8000/recipe/ingredient-autocomplete/', payload)
        .then((res) => {
          let data = res.data;
          setIngredientAutoList(data.ingredients);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
  };
  
  // Acquires the list of popular recipes from the backend
  const getPopularRecipes = async (rows, p) => {
    let currPage = p + 1; 
    await axios.get(`http://localhost:8000/social/popular-recipes/${'?page=' + currPage + '&page_size=' + rows}`)
      .then((res) => {
        // console.log(res.data)
        let data = res.data.results;
        
        if (data.length > 0) {
          data = data.map((recipe) => {
            for (let i = 0; i < recipe.images.length; i++) {
              recipe.images[i] = `http://localhost:8000${recipe.images[i]}`;
            }
            return recipe;
          });
        }
        const recipes = [...popularDishes].concat(data);
        setPopularDishes(recipes);
        setTotalNumberOfRecipes(res.data.count);
        setHasNext(res.data.next !== null);
        setIsLoadingPopularDishes(false);
      })
      .catch((err) => {
        console.log(err);
        // setHasNext(false);
        // console.log(err.message);
      });
  };

  // Acquires the filtered list of popular recipes from the backend
  const getFilteredPopularRecipes = async (rows, p) => {
    // console.log('acquiring data...')
    // console.log('before: is loading', isLoadingPopularDishes, 'hasnext', hasNext, 'page', p)
    // if not loading and has more recipes to load
    if (!isLoadingPopularDishes) {
      // console.log('loading....')
      setIsLoadingPopularDishes(true);

      let recipe_name = formData.name;

      if (formDataChanged) {
        recipe_name = formData.name;
      } else if (query && !queryStatus) {
        recipe_name = query;
        setQueryStatus(true);
      }
      // console.log(formData)
      let currPage = p + 1;
      let payload = {
        "recipe_name": recipe_name,
        "creator": formData.author,
        "ingredients": formData.ingredient,
        "cuisines": filtersList.cuisines.filter((item) => item.checked).map((item) => item.value),
        "diets": filtersList.diets.filter((item) => item.checked).map((item) => item.value),
        "sort": sort
      };

      let cooking_time = parseInt(filtersList.cookingTime.find((item) => item.checked)?.value)
      if (cooking_time) {
        payload.cooking_time = cooking_time;
      }

      // console.log(payload)
  
      let dishes = popularDishes;
      if (formDataChanged) {
        dishes = [];
        setFormDataChanged(false);
      }

      await axios.post(`http://localhost:8000/search/recipe-filter/${'?page=' + currPage + '&page_size=' + rows}`, payload)
        .then((res) => {

          let data = res.data.results;
          setHasNext(res.data.next !== null);

          if (data && data?.length > 0) {
            
            // add images to recipes
            data = data.map((recipe) => {
              for (let i = 0; i < recipe.images.length; i++) {
                recipe.images[i] = `http://localhost:8000${recipe.images[i]}`;
              }
              return recipe;
            });

            if (sorted || resetForm) {
              setPopularDishes(data);
              setSorted(false);
            } else {
              // Checks for duplicates and removes them
              data = data.filter(recipe => !dishes.some(popularRecipe => popularRecipe.recipe_id === recipe.recipe_id));
            }
            
          }
          
          let recipes = [...dishes].concat(data);
          // console.log('recipes', recipes, data)
          if (!sorted && !resetForm) {
            setPopularDishes(recipes);
          }
          setTotalNumberOfRecipes(res.data.count);
          setIsLoadingPopularDishes(false);
        })
        .catch((err) => {
          setHasNext(false);
        });
    }
  
    // console.log('after: is loading', isLoadingPopularDishes, 'hasnext', hasNext, 'page', p)
  };

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

  // sets the recipe rating if it is null
  const setRecipeRating = (recipeId, rating) => {
    axios.post(`http://localhost:8000/social/recipe-rating/`, {
      recipe_id: recipeId,
      rating: rating
    })
    .then((res) => {
      const updatedDishes = popularDishes.map((dish) => {
        if (dish.recipe_id === recipeId) {
          dish.ratings_count++;
          dish.ratings = parseFloat((rating / dish.ratings_count).toFixed(2));
          dish.rating_status = true;
        }
        return dish;
      });
      setPopularDishes(updatedDishes);
    })
    .catch((err) => {
      console.log(err.message);
    });
  }

  // sets the recipe rating if it is not null
  const updateRecipeRating = (recipeId, rating) => {
    axios.patch(`http://localhost:8000/social/recipe-rating/${recipeId}/`, {
      rating: rating
    })
    .then((res) => {
      let data = res.data;
      const updatedDishes = popularDishes.map((dish) => {
        if (dish.recipe_id === recipeId) {
          let total_rating = dish.ratings * dish.ratings_count;
          let new_rating = total_rating + rating - data.old_rating;
          dish.ratings = parseFloat((new_rating / dish.ratings_count).toFixed(2));
        }
        return dish;
      });
      setPopularDishes(updatedDishes);
    })
    .catch((err) => {
      console.log(err.message);
    });
  };

  const setRecipeLike = (recipeId, like) => {
    axios.post(`http://localhost:8000/social/recipe-favorite/`, {
      recipe_id: recipeId,
      like: like
    })
    .then((res) => {
      const updatedDishes = popularDishes.map((dish) => {
        if (dish.recipe_id === recipeId) {
          dish.likes++;
          dish.like_status = true;
        }
        return dish;
      });
      setPopularDishes(updatedDishes);
    })
  };

  // sets the recipe rating if it is not null
  const updateRecipeLikes = (recipeId, newLikes) => {
    axios.patch(`http://localhost:8000/social/recipe-favorite/${recipeId}/`, {
      like: newLikes
    }).then((res) => {
      const updatedDishes = popularDishes.map((dish) => {
          if (dish.recipe_id === recipeId) { 
            if (newLikes) dish.likes++; 
            else dish.likes--; 
          }
          return dish;
        });
        setPopularDishes(updatedDishes);
      })
      .catch((err) => {
        console.log(err.message);
     });
  };

  useEffect(() => {
    if (query) {
      setFormData({
        ...formData,
        name: query
      })
    }
    checkIsAuth();
    getFilters();
    getFilterAutoComplete('', '', 'input');
    setPopularDishes([]);
    // getFilteredPopularRecipes(rowsPerPage, page);
  }, []);

  useEffect(() => {
    if (resetForm || sorted) {
      // console.log('reset form', resetForm, sorted)
      getFilteredPopularRecipes(10, 0);
      setResetForm(false);
    }
  }, [resetForm, sorted]);

  useEffect(() => {
    if (query) {
      setFormData({ ...formData, name: query });
      setLoadData(true);
    }
  }, [query]);


  useEffect(() => {
    if (loadData) {
      // console.log('loading data')
      getFilteredPopularRecipes(10, 0);
      setLoadData(false);
    }
  }, [loadData]);

  useEffect(() => {
    if (!query && hasNext) {
      getFilteredPopularRecipes(rowsPerPage, page);
    }
  }, [page])

  return ( 
    <div className="popular-recipes container mt-3">
      <ScrollTopButton />
      <div className="col-12 col-lg-10 pe-0">
            <div className="row m-0">
              {/* <!-- Inquiry columns  --> */}
              <div className="inquiry col-4">
                <FilterForm 
                  getIngredientLabel={getIngredientLabel}
                  setSorted={setSorted}
                  handleIngredientChange={handleIngredientChange}
                  totalNumberOfRecipes={totalNumberOfRecipes}
                  formData={formData}
                  handleFormChange={handleFormChange}
                  ingredientAutoList={ingredientAutoList}
                  getFilterAutoComplete={getFilterAutoComplete}
                  filtersList={filtersList}
                  handleChange={handleChange}
                  sort={sort}
                  getSortTooltip={getSortTooltip}
                  sortAscend={sortAscend}
                  sortClear={sortClear}
                  sortDescend={sortDescend}
                  getFilteredPopularRecipes={getFilteredPopularRecipes}
                  formDataChanged={formDataChanged}
                  setFormDataChanged={setFormDataChanged}
                  resetFields={resetFields}
                />
          
              </div>
              {/* <!-- Popular Dishes --> */}
              <div className="col-8 m-0">
                  <Box>
                    <div className="scrollable-col">
                      <div className="cards p-0 m-0 mx-auto" style={{maxWidth: '480px'}}>
                        
                        {/* <!-- Dishes --> */}
                        { popularDishes?.length === 0 &&
                          isLoadingPopularDishes && 
                          Array.from({ length: 5 }, (_, index) => (
                          <SkeletonRecipeCard key={index} /> 
                        ))}

                        <InfiniteScroll
                          dataLength={popularDishes?.length}
                          next={() => {setPage(page + 1)}}
                          hasMore={hasNext}
                          loader={
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <CircularProgress />
                            </div> 
                          }
                        >
                          { popularDishes?.length !== 0 && popularDishes?.map((recipe, index) => (
                            <RecipeCard 
                              recipe={recipe} 
                              index={index}
                              key={recipe.recipe_id} 
                              popularDishes={popularDishes}
                              setPopularDishes={setPopularDishes}
                              isAuth={isAuth}
                              setRecipeLike={setRecipeLike}
                              updateRecipeLikes={updateRecipeLikes}
                              setRecipeRating={setRecipeRating}
                              updateRecipeRating={updateRecipeRating}
                              />
                          ))}
                        </InfiniteScroll>
                      </div>
                    </div>
                  </Box>
                  {/* <TablePagination
                    className="pagination-box"
                    component="div"
                    count={totalNumberOfRecipes}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                  <div>&nbsp;</div> 
                   */}
                  { !hasNext && popularDishes.length !== 0 &&
                    <div className="">
                      <div className="d-flex justify-content-center align-items-center py-4 text-muted"
                        style={{
                          height: '50px',
                        }}>
                        - End of Results -
                      </div>
                    </div>
                  }
                  {
                    popularDishes.length === 0 && !isLoadingPopularDishes &&
                    <div className="d-flex justify-content-center align-items-center py-4 text-muted"
                      style={{
                        height: '90vh',
                      }}>
                      - No Results -
                    </div>
                  }
              </div>
            </div>
      </div>
      
    </div>
   );
}
 
export default PopularRecipes;