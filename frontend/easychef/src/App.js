// import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Home from './pages/Home/Home';
import MyRecipes from './pages/MyRecipes/MyRecipes';
import Navbar from './components/Navbar';
import RecipeCreate from './pages/Recipes/RecipeCreate';
import RecipeDetails from './pages/Recipes/RecipeDetails';
import ShoppingCart from './pages/ShoppingCart/ShoppingCart';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import PopularRecipes from './pages/PopularRecipes/PopularRecipes';
import ErrorNotFound from './pages/Error/ErrorNotFound';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <div className="App">
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} setIsAuth={setIsAuth} />} />
        <Route path="/login" element={<Login isAuth={isAuth} setIsAuth={setIsAuth}  />} />
        <Route path="/register" element={<Register />} />

        <Route path="/popular-recipes/:query" element={<PopularRecipes isAuth={isAuth} setIsAuth={setIsAuth} />}></Route>
        <Route path="/popular-recipes" element={<PopularRecipes isAuth={isAuth} setIsAuth={setIsAuth} />}></Route>

        <Route path="/my-recipes" element={<MyRecipes isAuth={isAuth} />} />
        <Route path="/create-recipe" element={<RecipeCreate isAuth={isAuth} isEdit={false} />}></Route>
        <Route path="/build-on-recipe/:id" element={<RecipeCreate isAuth={isAuth} isEdit={false} />}></Route>
        <Route path="/edit-my-recipe/:id" element={<RecipeCreate isAuth={isAuth} isEdit={true} />}></Route>
        <Route path="/shopping-cart" element={<ShoppingCart isAuth={isAuth} />}></Route>
        <Route path="/recipe-detail/:id" element={<RecipeDetails isAuth={isAuth} />}></Route>

        <Route path="/profile" element={<Profile isAuth={isAuth} setIsAuth={setIsAuth} />}></Route>
        <Route path="/edit-profile" element={<EditProfile isAuth={isAuth} setIsAuth={setIsAuth} />}></Route>

        <Route path="*" element={<ErrorNotFound />} />
        
        
      </Routes>
    </div>
  );
}

export default App;
