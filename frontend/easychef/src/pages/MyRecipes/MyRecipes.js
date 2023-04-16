import React from "react";
import "./my-recipes.css";
import RecipeCard from "./components/RecipeCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button, TablePagination } from "@mui/material";
import NotAuthorized from "../Error/NotAuthorized";

const MyRecipes = ({ isAuth }) => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [pageSize, setPageSize] = useState(6);
  const [currentPost, setCurrentPost] = useState("posts");
  const [totalRecipes, setTotalRecipes] = useState(0);

  function switchposts(e) {
    setPage(0);
    e.preventDefault();
    if (e.target.id === "posts") {
      e.target.classList.add("active");
      document.getElementById("likes").classList.remove("active");
      document.getElementById("interactions").classList.remove("active");
      setCurrentPost("posts");
      fetch_data("posts");
    } else if (e.target.id === "likes") {
      e.target.classList.add("active");
      document.getElementById("posts").classList.remove("active");
      document.getElementById("interactions").classList.remove("active");
      setCurrentPost("likes");
      fetch_data("likes");
    } else if (e.target.id === "interactions") {
      e.target.classList.add("active");
      document.getElementById("posts").classList.remove("active");
      document.getElementById("likes").classList.remove("active");
      setCurrentPost("interactions");
      fetch_data("interactions");
    }
  }

  async function fetch_data(type) {
    let url = "";
    let currPage = page + 1;
    let details = `${"?page=" + currPage + "&page_size=" + pageSize}`;
    if (type === "likes") {
      url = "http://localhost:8000/social/favorite-recipes/" + details;
    } else if (type === "interactions") {
      url = "http://localhost:8000/social/interacted-recipes/" + details;
    } else {
      url = "http://localhost:8000/social/my-recipes/" + details;
    }
    await axios
      .get(url)
      .then((res) => {
        if (res.data.count !== 0) {
          let results = res.data.results;
          setTotalRecipes(res.data.count);
          if (type === "likes" || type === "interactions") {
            setRecipes(results);
          } else {
            setRecipes(results.recipes);
          }
        } else {
          setRecipes([]);
        }
        setHasNext(!!res.data.next);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetch_data(currentPost);
  }, [page, pageSize]);

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (hasNext) {
      setPage(page + 1);
    }
  };

  return (
    <React.Fragment>
    {isAuth ? (
    <div className="my-recipes">
      {/* <!-- Main Content --> */}
      <div className="container">
        <h1>My Recipes</h1>
        <div className="my-recipe-nav">
          <ul className="nav nav-pills nav-justified">
            <li key="posts" className="nav-item my-recipe-nav-item">
              <a
                id="posts"
                href="#"
                className="nav-link active"
                onClick={switchposts}
                active="true"
              >
                Posts
              </a>
            </li>
            <li key="likes" className="nav-item my-recipe-nav-item">
              <a id="likes" href="#" className="nav-link" onClick={switchposts}>
                Liked
              </a>
            </li>
            <li key="interactions" className="nav-item my-recipe-nav-item">
              <a
                id="interactions"
                href="#"
                className="nav-link"
                onClick={switchposts}
              >
                Interactions
              </a>
            </li>
          </ul>
        </div>

        {/* <!-- My Recipes Navigation --> */}
        <div className="row m-0">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          {recipes.length === 0 && (
            <h3 className="text-center" style={{marginTop: "250px"}}>
              No recipes to show
            </h3>
          )}
        </div>
        {recipes.length !== 0 &&
        <div 
          className="my-3 mx-3"
          fullwidth="true"
          style={{ justifyContent: "center", display: "flex", background: '#F1D18D'}}>
          <TablePagination
            className="my-recipes-pagination"
            component="div"
            count={totalRecipes}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[6, 12, 24, 48, 96]}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
           />
        </div>
        }
      </div>
    </div>
    ) : (
      <NotAuthorized />
    )}
    </React.Fragment>
  );
};

export default MyRecipes;
