import React, { useEffect, useState } from "react";

import "./recipe-create.css";
import { Box, Button, IconButton, Checkbox, TextField, Autocomplete, Alert, AlertTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CloseIcon from '@mui/icons-material/Close';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import NotAuthorized from "../Error/NotAuthorized";
import { useLocation } from "react-router-dom";

const RecipeCreate = ({ isAuth, isEdit }) => {
  let recipe_id = -1;
  let instruction_id = [];
  let ingredient_id = [];
  let diets_list = [];
  let cuisines_list = [];
  const [alert, setAlert] = useState(false);

  const location = useLocation();
  useEffect(() => {
    setBaseRecipeId(window.location.pathname.split("/")[2]);
  }, [location]);

  const [baserecipeId, setBaseRecipeId] = useState(
    window.location.pathname.split("/")[2]
  );
  const navigate = useNavigate();
  const [recipeName, setRecipeName] = useState("");
  const [recipeNameError, setRecipeNameError] = useState("");

  const [cuisines, setCuisines] = useState([
    { name: "American", value: "A", checked: false },
    { name: "Brazilian", value: "B", checked: false },
    { name: "Chinese", value: "C", checked: false },
    { name: "Korean", value: "K", checked: false },
    { name: "Japanese", value: "J", checked: false },
    { name: "Other Cuisine", value: "O", checked: false },
  ]);
  const [cuisinesError, setCuisinesError] = useState("");

  const [diets, setDiets] = useState([
    { name: "Vegan", value: "VG", checked: false },
    { name: "Vegetarian", value: "V", checked: false },
    { name: "Gluten Free", value: "GF", checked: false },
    { name: "Dairy Free", value: "DF", checked: false },
    { name: "Other Diet", value: "O", checked: false },
  ]);

  const [dietsError, setDietsError] = useState("");

  const [ingredients, setIngredients] = useState([
    { ingredients_name: "", quantity: "" },
  ]);
  const [ingredientsError, setIngredientsError] = useState([[false, false]]);

  const [servings, setServings] = useState("");
  const [servingsError, setServingsError] = useState("");

  const [cookingTime, setCookingTime] = useState("");
  const [cookingTimeError, setCookingTimeError] = useState("");

  const [prepTime, setPrepTime] = useState("");
  const [prepTimeError, setPrepTimeError] = useState("");

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [instructions, setInstructions] = useState([
    { instruction: "", step_number: 1, time: "", images: [] },
  ]);
  const [oldInstructionImages, setOldImages] = useState([]);
  const [instructionsError, setInstructionsError] = useState([[false, false]]);

  const [recipeImages, setRecipeImages] = useState([]);
  const [oldImages, setOldRecipeImages] = useState([]);

  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [parent_recipe, setParentRecipe] = useState("");
  const [ingredientAutoList, setIngredientAutoList] = useState([]);
  
  const getFilterAutoComplete = async (event, value, reason) => {
    if (reason === 'input') {
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

  const updateName = (event) => {
    if (event.target.value === "") {
      setRecipeNameError("Recipe name cannot be empty");
    } else {
      setRecipeNameError("");
    }
    setRecipeName(event.target.value);
  };

  const updateDescription = (event) => {
    if (event.target.value === "") {
      setDescriptionError("Description cannot be empty");
    } else {
      setDescriptionError("");
    }
    setDescription(event.target.value);
  };

  const updateDiets = (newDietFilters) => {
    if (
      newDietFilters.every((diet) => {
        return diet.checked === false;
      })
    ) {
      setDietsError("At least one diet must be selected");
    } else {
      setDietsError("");
    }
    setDiets(newDietFilters);
  };

  const updateCuisines = (newCuisineFilters) => {
    if (
      newCuisineFilters.every((cuisine) => {
        return cuisine.checked === false;
      })
    ) {
      setCuisinesError("At least one cuisine must be selected");
    } else {
      setCuisinesError("");
    }
    setCuisines(newCuisineFilters);
  };

  const addIngredient = () => {
    let newIngredients = [...ingredients];
    newIngredients.push({ ingredients_name: "", quantity: "" });
    setIngredients(newIngredients);

    let newIngredientsError = [...ingredientsError];
    newIngredientsError.push([false, false]);
    setIngredientsError(newIngredientsError);
  };

  const updateIngredient = (newIngredients) => {
    setIngredients(newIngredients);
  };

  const updateServings = (event) => {
    if (event.target.value === "") {
      setServingsError("Servings cannot be empty");
    } else if (isNaN(event.target.value)) {
      setServingsError("Servings must be a number");
    } else if (event.target.value < 1) {
      setServingsError("Servings cannot be less than 1");
    } else {
      setServingsError("");
    }
    setServings(event.target.value);
  };

  const updateCookingTime = (event) => {
    if (event.target.value === "") {
      setCookingTimeError("Cooking time cannot be empty");
    } else if (isNaN(event.target.value)) {
      setCookingTimeError("Cooking time must be a number");
    } else if (event.target.value < 1) {
      setCookingTimeError("Cooking time cannot be less than 1");
    } else {
      setCookingTimeError("");
    }
    setCookingTime(event.target.value);
  };

  const updatePrepTime = (event) => {
    if (event.target.value === "") {
      setPrepTimeError("Prep time cannot be empty");
    } else if (isNaN(event.target.value)) {
      setPrepTimeError("Prep time must be a number");
    } else if (event.target.value < 1) {
      setPrepTimeError("Prep time cannot be less than 1");
    } else {
      setPrepTimeError("");
    }
    setPrepTime(event.target.value);
  };

  const addInstruction = () => {
    let newInstructions = [...instructions];
    let newIndex = newInstructions.length + 1;
    newInstructions.push({
      instruction: "",
      step_number: newIndex,
      time: "",
      images: [],
    });
    setInstructions(newInstructions);

    let newInstructionsError = [...instructionsError];
    newInstructionsError.push([false, false]);
    setInstructionsError(newInstructionsError);
  };

  const updateInstructions = (newInstructions) => {
    setInstructions(newInstructions);
  };

  const updateImages = (newImages) => {
    setRecipeImages(newImages);
  };

  const validate_recipe = () => {
    let valid = true;
    if (recipeName === "") {
      setRecipeNameError("Recipe name cannot be empty");
      valid = false;
    } else {
      setRecipeNameError("");
    }

    if (description === "") {
      setDescriptionError("Description cannot be empty");
      valid = false;
    } else {
      setDescriptionError("");
    }

    if (
      cuisines.every((cuisine) => {
        return cuisine.checked === false;
      })
    ) {
      setCuisinesError("At least one cuisine must be selected");
      valid = false;
    } else {
      setCuisinesError("");
    }

    if (
      diets.every((diet) => {
        return diet.checked === false;
      })
    ) {
      setDietsError("At least one diet must be selected");
      valid = false;
    } else {
      setDietsError("");
    }

    let newIngredientsError = [...ingredientsError];
    ingredients.forEach((ingredient, index) => {
      if (ingredient.ingredients_name === "") {
        newIngredientsError[index][0] = true;
        valid = false;
      } else {
        newIngredientsError[index][0] = false;
      }

      if (
        !ingredient.quantity ||
        isNaN(ingredient.quantity) ||
        ingredient.quantity < 1
      ) {
        newIngredientsError[index][1] = true;
        valid = false;
      } else {
        newIngredientsError[index][1] = false;
      }
    });
    setIngredientsError(newIngredientsError);

    if (servings === "") {
      setServingsError("Servings cannot be empty");
      valid = false;
    } else if (isNaN(servings)) {
      setServingsError("Servings must be a number");
      valid = false;
    } else if (servings < 1) {
      setServingsError("Servings cannot be less than 1");
      valid = false;
    } else {
      setServingsError("");
    }

    if (cookingTime === "") {
      setCookingTimeError("Cooking time cannot be empty");
      valid = false;
    } else if (isNaN(cookingTime)) {
      setCookingTimeError("Cooking time must be a number");
      valid = false;
    } else if (cookingTime < 1) {
      setCookingTimeError("Cooking time cannot be less than 1");
      valid = false;
    } else {
      setCookingTimeError("");
    }

    if (prepTime === "") {
      setPrepTimeError("Prep time cannot be empty");
      valid = false;
    } else if (isNaN(prepTime)) {
      setPrepTimeError("Prep time must be a number");
      valid = false;
    } else if (prepTime < 1) {
      setPrepTimeError("Prep time cannot be less than 1");
      valid = false;
    } else {
      setPrepTimeError("");
    }

    let newInstructionsError = [...instructionsError];
    instructions.forEach((instruction, index) => {
      if (instruction.instruction === "") {
        newInstructionsError[index][0] = true;
        valid = false;
      } else {
        newInstructionsError[index][0] = false;
      }

      if (
        !instruction.time ||
        isNaN(instruction.time) ||
        instruction.time < 1
      ) {
        newInstructionsError[index][1] = true;
        valid = false;
      } else {
        newInstructionsError[index][1] = false;
      }
    });
    setInstructionsError(newInstructionsError);

    return valid;
  };

  const submitRecipe = async () => {
    if (!validate_recipe()) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
      setAlert(true);
      
      setTimeout(() => {
        setAlert(false);
      }, 2000);
      return;
    }

    ingredient_id = [];
    instruction_id = [];
    //add dites value to diets if checked
    diets_list = [];
    diets.forEach((diet) => {
      if (diet.checked) {
        diets_list.push(diet.value);
      }
    });
    //add cuisines value to cuisines if checked
    cuisines_list = [];
    cuisines.forEach((cuisine) => {
      if (cuisine.checked) {
        cuisines_list.push(cuisine.value);
      }
    });
    ingredients.forEach((ingredient) => {
      ingredient.quantity = parseInt(ingredient.quantity);
    });
    instructions.forEach((instruction) => {
      instruction.time = parseInt(instruction.time);
    });

    let method = "POST";
    let url = "http://localhost:8000/recipe/recipe-create/";

    if (isEdit) {
      method = "PATCH";
      url = "http://localhost:8000/recipe/recipe-edit/" + baserecipeId + "/";
    }

    let baseRecipe = null;
    if (parent_recipe) {
      baseRecipe = parent_recipe;
    }
    else if (baserecipeId) {
      baseRecipe = baserecipeId;
    }

    let data = null;

    if (isEdit) {
      data = {
        recipe_name: recipeName,
        diets: diets_list,
        cuisines: cuisines_list,
        serving: parseInt(servings),
        cooking_time: parseInt(cookingTime),
        preparation_time: parseInt(prepTime),
        ingredients: ingredients,
        steps: instructions,
        description: description,
      }
    }
    else {
      data = 
        {
          recipe_name: recipeName,
          diets: diets_list,
          cuisines: cuisines_list,
          serving: parseInt(servings),
          cooking_time: parseInt(cookingTime),
          preparation_time: parseInt(prepTime),
          ingredients: ingredients,
          steps: instructions,
          description: description,
          baseRecipe: baseRecipe,
        }
      }

    await axios({
      url: url,
      method: method,
      data: data,
    })
      .then((response) => {
        recipe_id = response.data.recipe_id;
        response.data.ingredients_id.forEach((id, index) => {
          ingredient_id.push(id);
        });
        imagesToDelete.forEach((image) => {
          deleteImage(image, recipe_id);
        });
        response.data.instruction_id.forEach((id, index) => {
          instruction_id.push(id);
          instructions[index].images.forEach((image) => {
            const formData = new FormData();
            formData.append("images", image);
            formData.append("parent_instruction", id);
            formData.append("parent_recipe", recipe_id);
            axios({
              method: "POST",
              url: "http://localhost:8000/recipe/add-image/",
              data: formData,
              headers: {
                "Content-Type": "multipart/form_data",
              },
            }).catch((error) => {
              console.log(error);
            });
          });
        });
        recipeImages.forEach((image) => {
          const formData = new FormData();
          formData.append("images", image);
          formData.append("parent_instruction", 0);
          formData.append("parent_recipe", recipe_id);
          axios({
            method: "POST",
            url: "http://localhost:8000/recipe/add-image/",
            data: formData,
            headers: {
              "Content-Type": "multipart/form_data",
            },
          }).catch((error) => {
            console.log(error);
          });
        });
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
        navigate("/recipe-detail/" + recipe_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteImage = async (image, recipe_id) => {
    await axios({
      url: "http://localhost:8000/recipe/delete-image/",
      method: "DELETE",
      data: {
        main_image: image,
        parent_id: recipe_id
      },
    });
  };

  useEffect(() => {
    if (baserecipeId) {
      axios
        .get("http://localhost:8000/recipe/recipe-detail/" + baserecipeId + "/")
        .then((response) => {
          if (isEdit) {
            setRecipeName(response.data.recipe_name);
            setDescription(response.data.description);
          }

          setServings(response.data.serving);
          setCookingTime(response.data.cooking_time);
          setPrepTime(response.data.preparation_time);
          // For ingredients and instructions, make sure to sync their
          // error arrays!
          let newIngredientsError = [];
          response.data.ingredients.forEach(() => {
            newIngredientsError.push([false, false]);
          });
          setIngredientsError(newIngredientsError);
          setIngredients(response.data.ingredients);
          let newInstructionsError = [];
          let instructionImages = [];
          response.data.steps.forEach((step) => {
            newInstructionsError.push([false, false]);
            instructionImages.push(step.images);
            step.images = [];
          });
          setOldImages(instructionImages);
          updateInstructions(response.data.steps);
          setInstructionsError(newInstructionsError);

          setParentRecipe(response.data.base_recipe_id);

          // Diets here
          let newDiets = [...diets];
          response.data.diet.forEach((value) => {
            newDiets.forEach((diet) => {
              if (diet.value === value) {
                diet.checked = true;
              }
            });
          });
          setDiets(newDiets);

          // Cuisines here
          let newCuisines = [...cuisines];
          response.data.cuisine.forEach((value) => {
            newCuisines.forEach((cuisine) => {
              if (cuisine.value === value) {
                cuisine.checked = true;
              }
            });
          });
          setCuisines(newCuisines);
          setOldRecipeImages(response.data.images);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [baserecipeId, cuisines, diets, isEdit]);

  return (
    <React.Fragment>
      {isAuth ? (
        <div className="recipe-create">
        {alert && <Alert 
          // style={{ 
          //   position: 'absolute',
          //   top: '12%',
          //   left: '810px',
          //   alignContent: 'center',
          // }}
          className="px-3"
          style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)'}}
          severity="error"
          elevation={1}>
          <div className="d-flex">
            <div>
              <AlertTitle>Error</AlertTitle>
              Missing required fields
            </div>
            <IconButton
              aria-label="close"
              style={{
                width: '3rem',
                padding: 0,
              }} 
              size="small"
              onClick={() => {setAlert(false)}}>
              <CloseIcon />
            </IconButton>
          </div>
        </Alert>}
          {/* Recipe name component */}
          <div className="container content pt-3">
            <h1
              className="text-uppercase py-2 mx-3 rounded-4 title-banner"
              style={{ backgroundColor: "rgb(238, 216, 170)" }}
            >
              {isEdit ? "Edit Recipe" : "Recipe Creation"}
            </h1>

            {/* main container starts here */}
            <div className="container mx-auto">
              <div className="main-form row m-0 p-3 mt-3">
                {/* recipe name component */}
                <div className="form-section form-top mb-2 p-4 pb-2 px-lg-5">
                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label
                      className="fs-5 text-uppercase"
                      htmlFor="recipe_name"
                    >
                      Recipe Name
                    </label>
                    <Box>
                      <TextField
                        id="recipe-name"
                        label="Recipe Name"
                        className="form-control border-0 rounded-0"
                        value={recipeName}
                        variant="standard"
                        error={!!recipeNameError}
                        helperText={recipeNameError ? recipeNameError : ""}
                        onChange={updateName}
                      />
                    </Box>
                  </div>
                </div>

                {/* recipe description component */}
                <div className="form-section mb-2 p-4 pb-2 px-lg-5">
                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label
                      className="fs-5 text-uppercase"
                      htmlFor="recipe_description"
                    >
                      Recipe Description
                    </label>
                    <Box>
                      <TextField
                        id="recipe-description"
                        label="Recipe Description"
                        className="form-control fw-light border-0 rounded-0 border border-dark placeholder-lg"
                        variant="standard"
                        value={description}
                        onChange={updateDescription}
                        error={!!descriptionError} // !! converts to boolean
                        helperText={descriptionError ? descriptionError : ""}
                      />
                    </Box>
                  </div>
                </div>

                {/* Image upload component must be able to remove images */}
                <div className="form-section my-2 p-3 px-lg-5">
                  <span className="fs-5 text-uppercase pb-3">Images</span>
                  <div className="d-flex align-content-center">
                    <span style={{ paddingTop: "4px", marginRight: '14px'}}>
                      Add Recipe Images
                    </span>
                    <input
                      multiple
                      type="file"
                      style={{ margin: 0, paddingTop: "4px" }}
                      className="button-image"
                      onChange={(event) => {
                        const imageArray = [];
                        [...event.target.files].forEach((file) => {
                          imageArray.push(file);
                        });
                        updateImages(imageArray);
                      }}
                    ></input>

                  </div>

                  <div className="row p-0 m-0">
                    <div className="col-12 d-flex mb-1">
                      {recipeImages.length !== 0 && 
                          <div className="w-100" >
                            <p className="" align="left">
                              Recipe Media:
                            </p>
                          <div className="d-flex w-100"
                          style={{
                            overflowX: "auto",
                            border: "1px solid #ced4da",
                            borderRadius: "0.25rem",
                            background: "#f1f1f144",
                          }}>
                            {recipeImages.map((image, i) => (
                              <div key={i} className="p-2">
                                { image.type.includes("video") ? (
                                  <video height={180} controls
                                    src={URL.createObjectURL(image)}
                                    alt="recipe"
                                    className="recipe-image"
                                  />
                                ) : (
                                  <img
                                    src={URL.createObjectURL(image)}
                                    // width={120}
                                    height={180}                                    
                                    alt="recipe"
                                    className="recipe-image"
                                  />
                                )}
                              </div>
                            ))}

                          </div>
                      </div>
                          }
                    </div>
                  </div>
                </div>

                {/* diets and cuisines section (INCLUDE ADD NEW DIETS/CUISINES?) */}
                <div className="form-section my-2 p-3 px-lg-5">
                  <div className="row" style={{ marginTop: "auto" }}>
                    <div className="col-1"></div>
                    <div className="col-5">
                      <h2
                        className="subheading fs-5 text-uppercase"
                        style={{ paddingRight: "100px" }}
                      >
                        Diet
                      </h2>

                      <div className="row p-0 m-0">
                        {diets.map((diet, index) => (
                          <div
                            key={diet.name}
                            className="col-6 d-flex justify-content-left align-items-center"
                          >
                            <Checkbox
                              id={diet.name}
                              className="form-check-input check-circle"
                              checked={diet.checked}
                              aria-label="..."
                              size="small"
                              onChange={(event) => {
                                const newDietFilters = [...diets];
                                newDietFilters[index].checked =
                                  event.target.checked;
                                updateDiets(newDietFilters);
                              }}
                            />
                            <label
                              className="form-check-label text-muted fw-light"
                              htmlFor={diet.name}
                              id="bottom-aligned"
                            >
                              {diet.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      {dietsError && (
                        <p style={{ color: "red", paddingRight: "100px" }}>
                          {dietsError}
                        </p>
                      )}
                    </div>
                    <div className="col-1"></div>
                    <div className="col-5">
                      <h2
                        className="subheading fs-5 text-uppercase"
                        style={{ paddingRight: "100px" }}
                      >
                        Cuisine
                      </h2>

                      <div className="row p-0 m-0">
                        {cuisines.map((cuisine, index) => (
                          <div
                            key={cuisine.name}
                            className="col-6 d-flex justify-content-left align-items-center"
                          >
                            <Checkbox
                              id={cuisine.name}
                              className="form-check-input check-circle"
                              checked={cuisine.checked}
                              name={cuisine.name}
                              aria-label="..."
                              size="small"
                              onChange={(event) => {
                                const newCuisineFilters = [...cuisines];
                                newCuisineFilters[index].checked =
                                  event.target.checked;
                                updateCuisines(newCuisineFilters);
                              }}
                            />
                            <label
                              htmlFor={cuisine.name}
                              className="form-check-label text-muted fw-light"
                              id="bottom-aligned"
                            >
                              {cuisine.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      {cuisinesError && (
                        <p style={{ color: "red", paddingRight: "100px" }}>
                          {cuisinesError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ingredients component*/}
                <div className="form-section my-2 p-3 px-lg-5">
                  {/* <!-- Ingredients Header --> */}
                  <div className="form-header d-flex align-items-center justify-content-center mb-3">
                    <div className="d-flex justify-content-center">
                      <span className="fs-5 text-uppercase">Ingredients</span>
                      <IconButton
                        variant="outlined"
                        size="small"
                        className="px-1 py-1 text-muted button-add-remove ms-2"
                        onClick={addIngredient}
                      >
                        <AddIcon />
                      </IconButton>
                    </div>
                  </div>

                  {/* Ingredients list (Include remove ingredient?) */}
                  <div className="row" style={{ marginTop: "auto" }}>
                    {ingredients.map((ingredient, index) => (
                      <div className="row" key={"Ingredient " + index + 1}>
                        <div className="col-8">
                          <div
                            className="form-group"
                            style={{ marginBottom: "20px" }}
                          >
                            <Autocomplete
                              id="create-ingredients"
                              freeSolo
                              options={ingredientAutoList}
                              onInputChange={
                                (event, value) => {
                                  getFilterAutoComplete(event, value, 'input');
                                  const newIngredients = [...ingredients];
                                  newIngredients[index].ingredients_name = value;
                                  updateIngredient(newIngredients);
  
                                  const newIngredientsError = [
                                    ...ingredientsError,
                                  ];
                                  if (value === "") {
                                    newIngredientsError[index][0] = true;
                                  } else {
                                    newIngredientsError[index][0] = false;
                                  }
                                  setIngredientsError(newIngredientsError);
                                }
                              }
                              getOptionLabel={(option) => {
                                // console.log(ingredientAutoList, option);
                                return option
                              }}
                              onChange={(event, value) => {
                                const newIngredients = [...ingredients];
                                newIngredients[index].ingredients_name = value;
                                updateIngredient(newIngredients);

                                const newIngredientsError = [
                                  ...ingredientsError,
                                ];
                                if (value === "") {
                                  newIngredientsError[index][0] = true;
                                } else {
                                  newIngredientsError[index][0] = false;
                                }
                                setIngredientsError(newIngredientsError);
                              }}
                              value={ingredient.ingredients_name || null}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  className="text-input-field form-control border-0 rounded-0 border placeholder-lg fw-light"
                                  label={"Ingredient " + (index + 1)}
                                  error={ingredientsError[index][0]}
                                  helperText={
                                    ingredientsError[index][0]
                                      ? "Ingredient field cannot be empty."
                                      : ""
                                  }
                                />)}
                              >
                            </Autocomplete>
                          </div>
                        </div>
                        <div className="col-3">
                          <div
                            className="form-group"
                            style={{ marginBottom: "20px" }}
                          >
                            <TextField
                              variant="standard"
                              value={ingredient.quantity}
                              className="text-input-field form-control border-0 rounded-0 border placeholder-lg fw-light"
                              label={"Quantity"}
                              onChange={(event) => {
                                const newIngredients = [...ingredients];
                                if (event.target.value < 0) { setIngredientsError("Quantity cannot be negative");} 
                                else { setIngredientsError(""); }
                                
                                newIngredients[index].quantity = event.target.value;
                                updateIngredient(newIngredients);

                                const newIngredientsError = [ ...ingredientsError ];
                                if ( !event.target.value || isNaN(event.target.value) ||event.target.value < 1 ) {
                                  newIngredientsError[index][1] = true;
                                } else {
                                  newIngredientsError[index][1] = false;
                                }
                                setIngredientsError(newIngredientsError);
                              }}
                              error={ingredientsError[index][1]}
                              helperText={
                                ingredientsError[index][1]
                                  ? "Quantity must be a positive number."
                                  : ""
                              }
                            ></TextField>
                          </div>
                        </div>
                        <div className="col-1">
                          <div className="d-flex justify-content-center align-items-center">
                            <IconButton
                              style={{marginTop: "13px", marginLeft: "0"}}
                              variant="outlined"
                              size="small"
                              className="px-1 py-1 text-muted button-add-remove"
                              onClick={(event) => {
                                if (ingredients.length !== 1) {
                                  let newIngredients = [...ingredients];
                                  newIngredients.splice(index, 1);
                                  updateIngredient(newIngredients);

                                  let newIngredientsError = [...ingredientsError];
                                  newIngredientsError.splice(index, 1);
                                  setIngredientsError(newIngredientsError);
                                }
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* include total cooking time in serving section, include nutrition facts*/}
                <div className="form-section my-2 p-3 px-lg-5">
                  <div
                    className="form-header align-content-center mb-3"
                    style={{ margin: "auto", width: 100 }}
                  >
                    <div
                      className="col-3 align-middle"
                      style={{ paddingRight: 0 }}
                    >
                      <h2 className="fs-5 text-uppercase">Servings</h2>
                    </div>
                  </div>
                  <div className="row pb-2">
                    <div className="col-4">
                      <TextField
                        variant="standard"
                        label="Servings"
                        className="form-control border-0 rounded-0 border placeholder-lg fw-light"
                        value={servings}
                        onChange={updateServings}
                        error={!!servingsError}
                        helperText={servingsError ? servingsError : ""}
                      />
                    </div>
                    <div className="col-4" style={{ paddingRight: 0 }}>
                      <TextField
                        variant="standard"
                        className="form-control border-0 rounded-0 border placeholder-lg fw-light"
                        label="Cooking Time"
                        value={cookingTime}
                        onChange={updateCookingTime}
                        error={!!cookingTimeError}
                        helperText={cookingTimeError ? cookingTimeError : ""}
                      />
                    </div>
                    <div className="col-4" style={{ paddingRight: 0 }}>
                      <TextField
                        variant="standard"
                        className="form-control border-0 rounded-0 border placeholder-lg fw-light"
                        label="Preparation Time"
                        value={prepTime}
                        onChange={updatePrepTime}
                        error={!!prepTimeError}
                        helperText={prepTimeError ? prepTimeError : ""}
                      />
                    </div>
                  </div>
                </div>

                {/* recipe instruction component must add and remove images */}
                <div className="form-section my-2 p-3 px-lg-5">
                  <div className="form-header d-flex align-items-center justify-content-center mb-3">
                    <div className="d-flex justify-content-center">
                      <span className="fs-5 text-uppercase">
                        Recipe Instructions
                      </span>
                      <IconButton
                        variant="outlined"
                        size='small'
                        className="px-1 py-1 btn btn-sm text-muted circle-btn button-add-remove ms-2"
                        onClick={addInstruction}
                      >
                        <AddIcon />
                      </IconButton>

                    </div>
                  </div>

                  <div className="form-content">
                    {instructions.map((instruction, index) => (
                      <div className="row" key={"Instruction " + (index + 1)}>
                        <div className="row p-0 m-0">
                          <div className="col-6">
                            <div
                              className="form-group"
                              style={{ marginBottom: "20px" }}
                            >
                              <TextField
                                variant="standard"
                                value={instruction.instruction}
                                className="text-input-field form-control border-0 rounded-0 border fw-light placeholder-lg"
                                label={
                                  "Instruction " + instruction.step_number
                                }
                                onChange={(event) => {
                                  const newInstructions = [...instructions];
                                  newInstructions[index].instruction =
                                    event.target.value;
                                  updateInstructions(newInstructions);

                                  let newInstructionsError = [
                                    ...instructionsError,
                                  ];
                                  if (event.target.value === "") {
                                    newInstructionsError[index][0] = true;
                                  } else {
                                    newInstructionsError[index][0] = false;
                                  }
                                  setInstructionsError(newInstructionsError);
                                }}
                                error={instructionsError[index][0]}
                                helperText={
                                  instructionsError[index][0]
                                    ? "Instruction field cannot be empty."
                                    : ""
                                }
                              />
                            </div>
                          </div>
                          <div className="col-3">
                            <TextField
                              variant="standard"
                              value={instruction.time}
                              className="text-input-field form-control border-0 rounded-0 border fw-light placeholder-lg"
                              label="Time"
                              onChange={(event) => {
                                const newInstructions = [...instructions];
                                newInstructions[index].time = event.target.value;
                                updateInstructions(newInstructions);

                                let newInstructionsError = [...instructionsError];
                                if (
                                  !event.target.value ||
                                  isNaN(event.target.value) ||
                                  event.target.value < 1
                                ) {
                                  newInstructionsError[index][1] = true;
                                } else {
                                  newInstructionsError[index][1] = false;
                                }
                                setInstructionsError(newInstructionsError);
                              }}
                              error={instructionsError[index][1]}
                              helperText={
                                instructionsError[index][1]
                                  ? "Time must be a positive whole number."
                                  : ""
                              }
                            />
                          </div>
                          <div className="col-2 p-0 button-image-div d-flex justify-content-start align-items-center">
                            <div className="">
                                <input
                                  multiple
                                  type="file"
                                  className="button-image"
                                  style={{ margin: 0, paddingTop: "4px" }}
                                  onChange={(event) => {
                                    const imageArray = [];
                                    const newInstructions = [...instructions];
                                    [...event.target.files].forEach((file) => {
                                      imageArray.push(file);
                                    });
                                    newInstructions[index].images = imageArray;
                                    updateInstructions(newInstructions);
                                  }}
                                />
                            </div>
                          </div>
                          <div className="col-1 p-0">
                            <div className="d-flex justify-content-start align-items-center h-100">
                              <IconButton
                                variant="outlined"
                                size="small"
                                className="px-1 py-1 text-muted button-add-remove"
                                onClick={() => {
                                  if (instructions.length !== 1) {
                                    const newInstructions = [...instructions];
                                    newInstructions.splice(index, 1);
                                    // recalculate step numbers
                                    newInstructions.forEach((instruction, i) => {
                                      instruction.step_number = i + 1;
                                    });
                                    updateInstructions(newInstructions);

                                    let newInstructionsError = [
                                      ...instructionsError,
                                    ];
                                    newInstructionsError.splice(index, 1);
                                    setInstructionsError(newInstructionsError);
                                  }
                                }}
                              >
                                <RemoveIcon />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                        <div className="row p-0 m-0">
                          <div className="col-12 d-flex mb-1">
                            {instructions[index].images.length !== 0 && 
                                <div className="w-100" >
                                  <p className="" align="left">
                                    Instruction {index+1} Media:
                                  </p>
                                <div className="d-flex w-100"
                                style={{
                                  overflowX: "auto",
                                  border: "1px solid #ced4da",
                                  borderRadius: "0.25rem",
                                  background: "#f1f1f144",
                                }}>
                                  {instructions[index].images.map((image, i) => (
                                    <div key={i} className="p-2">
                                      { image.type.includes("video") ? (
                                        <video height={180} controls
                                          src={URL.createObjectURL(image)}
                                          alt="recipe"
                                          className="recipe-image"
                                        />
                                      ) : (
                                        <img
                                          src={URL.createObjectURL(image)}
                                          // width={120}
                                          height={180}                                    
                                          alt="recipe"
                                          className="recipe-image"
                                        />
                                      )}
                                    </div>
                                  ))}

                                </div>
                            </div>
                                }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {baserecipeId && (
                  <div className="form-section my-2 p-3 px-lg-5">
                    <div className="w-100">
                      <span className="fs-5 text-uppercase pb-3">
                        {isEdit
                          ? "Note: The original images will remain on the server unless you delete them."
                          : "Note: The existing images of the base recipe will appear here."}
                      </span>
                    </div>
                    {oldImages.length !== 0 && isEdit && (
                      <div className="w-100">
                        <p style={{ width: "100%" }}>
                          {"Original Recipe Images:"}
                        </p>
                      </div>
                    )}
                    {oldImages.length !== 0 && isEdit && (
                      <div className="d-flex flex-row"
                        style={{
                          overflowX: "auto",
                        }}>
                        {oldImages.map((image, imagedex) => (
                          <div key={image} className="image-container m-2">
                            <img
                              key={imagedex}
                              src={"http://localhost:8000" + image}
                              alt={"for recipe"}
                              style={{ width: 100, margin: 5 }}
                            />
                            <Button
                              variant="contained bg-danger"
                              onClick={() => {
                                let newImages = [...oldImages];
                                newImages.splice(imagedex, 1);
                                setOldRecipeImages(newImages);

                                let newImagesToDelete = [...imagesToDelete];
                                newImagesToDelete.push(image);
                                setImagesToDelete(newImagesToDelete);
                              }}
                              //FIXME: pass a function to onClick instead of calling it
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {oldInstructionImages.map((imageList, index) => (
                      imageList.length !== 0 &&
                        <div className="w-100" key={index}>
                          <p style={{ width: "100%" }}>
                            {"Original images of instruction " +
                              (index + 1) +
                              ":"}
                          </p>
                          <div className="d-flex flex-row">
                            {imageList.map((image, imagedex) => (
                              <div className="image-container m-2" key={image}>
                                <img
                                  key={imagedex}
                                  src={"http://localhost:8000" + image}
                                  alt={"image for instruction " + index}
                                  style={{ width: 100, margin: 5 }}
                                />
                                <Button
                                  variant="contained bg-danger"
                                  onClick={() => {
                                    let newInstructionImages = [
                                      ...oldInstructionImages,
                                    ];
                                    newInstructionImages[index].splice(
                                      imagedex,
                                      1
                                    );
                                    setOldImages(newInstructionImages);

                                    let newImagesToDelete = [...imagesToDelete];
                                    newImagesToDelete.push(image);
                                    setImagesToDelete(newImagesToDelete);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      
                        
                      ))}
                  </div>
                )}

                <div className="d-flex justify-content-end">
                  
                  {isEdit ? 
                  <Button
                    onClick={submitRecipe}
                    variant="contained"
                    className="btn bg-warning"
                  >
                    Create
                  </Button> :
                   <Button
                   onClick={submitRecipe}
                   variant="contained"
                   className="btn bg-warning"
                  >
                     Edit
                  </Button>
                 }
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NotAuthorized />
      )}
    </React.Fragment>
  );
};

export default RecipeCreate;
