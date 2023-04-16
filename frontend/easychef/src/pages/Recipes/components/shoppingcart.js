import React from "react";
import axios from "axios";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "../recipe-details.css";
import { Tooltip } from "@mui/material";
import { useState } from "react";

const ShoppingCart = ({ shoppingList, setShoppingList, recipeName, recipeId, cartServings, setCartServings, ingredients}) => {

    const [error, setError] = useState("");

    function addToCart() {
        let method = "post";
        shoppingList.forEach((recipe) => {
          if (recipe.recipe_id === recipeId) {
            method = "patch";
          }
        });
        const formData = new FormData();
        formData.append("recipe_id", window.location.pathname.split("/")[2]);
        formData.append("quantity", cartServings);
        axios({
          method: method,
          url: "http://localhost:8000/recipe/shopping-list/",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            document.getElementById("close-modal").click();
          })
          .catch((err) => {
            setError("Error adding to cart");
          });
      }
    
    function fetchShoppingList() {
        axios
        .get("http://localhost:8000/recipe/shopping-list/")
        .then((res) => {
            setShoppingList(res.data.recipes);
        })
        .catch((err) => {
            console.log(err);
        });
    }


    return (
        <div>
            <div className="add-to-cart">
                <button
                type="button"
                className="btn btn-primary bg-dark"
                data-bs-toggle="modal"
                data-bs-target="#shoppingModal"
                onClick={fetchShoppingList}
                >
                <Tooltip>
                    <AddShoppingCartIcon />
                </Tooltip>
                Add to Cart
                </button>
            </div>

            <div
                className="modal fade"
                id="shoppingModal"
                tabIndex="-1"
                aria-labelledby="shoppingModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="shoppingModalLabel">
                                Shopping Cart
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="row m-0 mx-2">
                                Current Basket
                                <table className="current-basket w-100">
                                <thead>
                                    <tr>
                                    <td colSpan="2">Name</td>
                                    <td colSpan="1">Servings</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shoppingList.map((item, index) => (
                                    <tr key={index + item.recipe_name}>
                                        <td colSpan="2">{item.recipe_name}</td>
                                        <td colSpan="1">{item.servings}</td>
                                    </tr>
                                    ))}
                                    {shoppingList.length === 0 && (
                                    <tr>
                                        <td
                                        className="text-muted"
                                        colSpan="3"
                                        style={{ textAlign: "center" }}
                                        >
                                        No items in Basket
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                                </table>
                        </div>
                        <div className="row mx-2">
                            Add to Basket
                            <table className="purchase-table w-100">
                            <thead>
                                <tr>
                                <td colSpan="2">Name</td>
                                <td colSpan="1">Servings</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td colSpan="2">{recipeName}</td>
                                <td colSpan="1">
                                    <select
                                    className="form-select mx-0 d-flex h-100 align-items-center justify-content-center"
                                    aria-label="Default select example"
                                    onChange={(e) => setCartServings(e.target.value)}
                                    >
                                    <option defaultValue="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    </select>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        <div className="row mx-2">
                            Ingredients
                            <table className="ingredients-table w-100">
                            <thead>
                                <tr>
                                <td colSpan="2">Name</td>
                                <td colSpan="1">Quantity</td>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredients.map((item) => (
                                <tr key={item.ingredients_name}>
                                    <td colSpan="2">{item.ingredients_name}</td>
                                    <td colSpan="1">{item.quantity * cartServings}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        <div>
                            {error !== "" && 
                            <div className="fw-bold" style={{color: 'red', textAlign: 'center'}}role="alert">
                                {error}
                            </div>}
                        </div>
                    </div>
                        <div className="modal-footer">
                            <button
                                id="close-modal"
                                type="button"
                                className="btn btn-outline-dark"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={addToCart}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;