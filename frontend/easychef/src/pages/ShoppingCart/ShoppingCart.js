import React, { useEffect, useState } from "react";
import "./shopping-cart.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Button,
  InputLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import NotAuthorized from "../Error/NotAuthorized";

import { Link } from "react-router-dom";

const ShoppingCart = ({ isAuth }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [expanded, setExpanded] = useState(
    Array(shoppingList.length).fill(false)
  );
  const [shoppingListExpandStatus, setShoppingListExpandStatus] =
    useState(false);
  const [ingredientList, setIngredientList] = useState([]);

  const tableColumns = [
    { id: "name", label: "Ingredient Name", minWidth: 160, align: "left" },
    { id: "amount", label: "Amount", minWidth: 80, align: "right" },
    { id: "servings", label: "Servings", minWidth: 75, align: "right" },
    { id: "total", label: "Total", minWidth: 80, align: "right" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8000/recipe/shopping-list/")
      .then((response) => {
        setExpanded(Array(response.data.recipes.length).fill(false));
        setShoppingList(response.data.recipes);
        setIngredientList(response.data.ingredients);
      })
      .catch((error) => {
      });
  }, []);

  async function updateBasketList() {
    await axios
      .get("http://localhost:8000/recipe/shopping-list/")
      .then((response) => {
        setIngredientList(response.data.ingredients);
      })
      .catch((error) => {
      });
  }

  const changeServings = (item) => {
    return (event) => {
      const newServings = event.target.value;
      const newShoppingList = shoppingList.map((i) => {
        if (i.recipe_id === item.recipe_id) {
          i.servings = newServings;
        }
        return i;
      });
      setShoppingList(newShoppingList);
    };
  };

  const handleAccordionChange = (index) => (event, isExpanded) => {
    const newExpanded = [...expanded];
    newExpanded[index] = newExpanded[index] ? false : true;
    setExpanded(newExpanded);

    const isExpandedAll = newExpanded.every((item) => item === true);
    const isCollapsedAll = newExpanded.every((item) => item === false);

    if (isExpandedAll) {
      setShoppingListExpandStatus(true);
    } else if (isCollapsedAll) {
      setShoppingListExpandStatus(false);
    }
  };

  const handleExpandAll = () => {
    const newExpanded = [...expanded];
    newExpanded.fill(true);
    setExpanded(newExpanded);
    setShoppingListExpandStatus(true);
  };

  const handleCollapseAll = () => {
    const newExpanded = [...expanded];
    newExpanded.fill(false);
    setExpanded(newExpanded);
    setShoppingListExpandStatus(false);
  };

  async function submitCart() {
    await Promise.all(
      shoppingList.map((item) => {
        const formData = new FormData();
        formData.append("recipe_id", item.recipe_id);
        formData.append("quantity", item.servings);
        return axios
          .patch("http://localhost:8000/recipe/shopping-list/", formData)
          .then((response) => {})
          .catch((error) => {
          });
      })
    ).then(() => {
      updateBasketList();
    });
  }

  function clearCart() {
    shoppingList.map((item) => {
      const formData = new FormData();
      formData.append("recipe_id", item.recipe_id);
      axios({
        method: "delete",
        url: "http://localhost:8000/recipe/shopping-list/",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
        })
        .catch((error) => {
        });
    });
    setShoppingList([]);
    setIngredientList([]);
  }

  function removeItem(item) {
    const formData = new FormData();
    formData.append("recipe_id", item.recipe_id);
    axios({
      method: "delete",
      url: "http://localhost:8000/recipe/shopping-list/",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
      })
      .catch((error) => {
      });
    const newShoppingList = shoppingList.filter(
      (i) => i.recipe_id !== item.recipe_id
    );
    setShoppingList(newShoppingList);
    if (newShoppingList.length === 0) {
      setIngredientList([]);
    } else {
      updateBasketList();
    }
  }
  return (
    <React.Fragment>
    {isAuth ? (
    <div className="shopping-cart">
      {/* <!-- Main Content --> */}
      <div className="container">
        <div className="row m-0 mt-3">
          {/* <!-- Shopping List --> */}
          <div className="col-12 col-md-6">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="text-start text-uppercase">Shopping List</h1>

              {/* Show Expand all button if shoppingListExpandStatus is false */}
              {!shoppingListExpandStatus && (
                <Button
                  id="shopping-list-expand-all"
                  onClick={handleExpandAll}
                  className="text-capitalize"
                  size="small"
                  disableRipple
                  sx={{
                    height: "30px",
                    color: "white",
                    lineHeight: "1",
                    backgroundColor: "#F0BD99",
                  }}
                >
                  Expand All
                </Button>
              )}

              {/* Show Collapse all button if shoppingListExpandStatus is true */}
              {shoppingListExpandStatus && (
                <Button
                  onClick={handleCollapseAll}
                  id="shopping-list-collapse-all"
                  className="text-capitalize"
                  size="small"
                  sx={{
                    height: "30px",
                    lineHeight: "1",
                    color: "white",
                    backgroundColor: "#F0BD99",
                  }}
                >
                  Collapse All
                </Button>
              )}
            </div>

            <Box className="mb-3">
              {shoppingList.map((item, index) => (
                <Accordion
                  expanded={expanded[index]}
                  onChange={handleAccordionChange(index)}
                  id="shopping-list-box"
                  key={index}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="shopping-list-header"
                  >
                    <Box
                      className="d-flex"
                      sx={{
                        justifyContent: "space-between",
                        alignContent: "center",
                        width: "100%",
                      }}
                    >
                      <Link
                        to={`/recipe-detail/${item.recipe_id}`}
                        className="text-decoration-none"
                      >
                        <Typography
                          sx={{
                            fontFamily: "Oxygen",
                            fontWeight: 600,
                            color: "black",
                          }}
                        >
                          {item.recipe_name}
                        </Typography>
                      </Link>
                      <div className="d-flex align-items-center">
                        <FormControl fullWidth>
                          <TextField
                            labelid="shopping-cart-servings-label"
                            id="shopping-cart-servings"
                            value={item.servings}
                            label="Servings"
                            onChange={changeServings(item)}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onBlur={(e) => {
                              if (
                                !e.target.value ||
                                isNaN(e.target.value) ||
                                e.target.value < 1
                              ) {
                                item.servings = 1;
                              }
                              submitCart();
                            }}
                            size="small"
                            autowidth="true"
                            sx={{
                              color: "brown",
                              height: 35,
                              zIndex: 999,
                              width: 70,
                            }}
                          ></TextField>
                        </FormControl>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(item);
                          }}
                          size="small"
                          sx={{ padding: 0, marginLeft: "1px" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                    </Box>
                  </AccordionSummary>

                  {/* Shopping List Item Details */}
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableHead id="shopping-list-table-header">
                          <TableRow>
                            {tableColumns.map((column) => (
                              <TableCell
                                id="shopping-list-table-header-data"
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {item.ingredients.map((ingredient) => (
                            <TableRow
                              id="shopping-list-table-items"
                              key={ingredient.ingredients_name}
                            >
                              <TableCell>
                                {ingredient.ingredients_name}
                              </TableCell>
                              <TableCell align="right">
                                {ingredient.quantity}
                              </TableCell>
                              <TableCell align="right">
                                {item.servings}
                              </TableCell>
                              <TableCell align="right">
                                {ingredient.quantity * item.servings}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </div>

          {/* <!-- Basket Total --> */}
          <div className="col-12 col-md-6">
            <h1 className="text-start text-uppercase">Basket Total</h1>

            <Box
              id="shopping-list-box"
              sx={{
                padding: "10px",
              }}
            >
              <Table id="basket-table" size="small">
                <TableHead id="basket-table-header">
                  <TableRow id="basket-table-header-row">
                    <TableCell>Ingredient</TableCell>
                    <TableCell>Total Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody id="basket-table-body">
                  {ingredientList.map((item) => (
                    <TableRow key={item.ingredients_name}>
                      <TableCell>{item.ingredients_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <div className="d-flex justify-content-end my-3">
              {/* <button type="button" className="btn basket-btn me-2" onClick={submitCart}>Confirm</button> */}
              <button
                type="button"
                className="btn basket-btn"
                onClick={clearCart}
              >
                Clear All
              </button>
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

export default ShoppingCart;
