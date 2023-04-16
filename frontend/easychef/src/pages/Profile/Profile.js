import React from 'react';
import './profile.css'; 
import ProfileCard from './components/ProfileCard';
import ProfileRecipeCard from './components/ProfileRecipeCard';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import ScrollTopButton from '../../components/ScrollTopButton';
import NotAuthorized from '../Error/NotAuthorized';

const Profile = ({ isAuth }) => {

  const [profileInformation, setProfileInformation] = useState({
    // name: 'Hugh Jass',
    // email: 'huhh@gmail.com',
    // phone: '905-000-0000',
    // avatar: 'static\\profilepic.jpeg',
  });

  const [userRecipes, setUserRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const getUserProfile = async () => {
    await axios.get('http://localhost:8000/auth/viewprofile/')
      .then((res) => {
        let info = {
          ...res.data,
          name: res.data.first_name + ' ' + res.data.last_name,
          phone: res.data.phone_number
        }
        if (info.avatar) {
          info.avatar = 'http://localhost:8000' + info.avatar;
        }
        setProfileInformation(info);
      });
  }

const getUserRecipes = async () => {
  if (!isLoading) {
    setIsLoading(true);

    await axios.get(`http://localhost:8000/social/my-recipes/?page=${page}`)
      .then((res) => {
        
        let data = res.data;
        if (data.results.recipes.length > 0) {
          const recipes = [...userRecipes].concat(data.results.recipes);
          setUserRecipes(recipes);          
          
        if (!data.next) { setHasNext(false); }
      }
      setIsLoading(false);
    }).catch((err) => {
      console.log(err);
      setHasNext(false);
      setIsLoading(false);
    });
  }
}
  
  useEffect(() => {
    getUserProfile();
  }, [])

  useEffect(() => {
    getUserRecipes();
  }, [page])

  return ( 
    <div id="profile">
      { isAuth ? 
        <div>
          <ScrollTopButton />
          <div className="container pt-3">
            <ProfileCard 
              profileInformation={profileInformation} 
              mode={"view"}
              />
              <div className="container px-5 pb-5"
                style={{ background: '#FCFCFC88' }}>
                  <div className="px-3">
                    <h2 className="text-uppercase">Recipes</h2>
                  </div>

                  <InfiniteScroll
                    dataLength={userRecipes.length}
                    next={() => setPage(page + 1)}
                    hasMore={hasNext}
                    // loader={
                    //   hasNext 
                    //   ? <div style={{ display: 'flex', justifyContent: 'center' }}>
                    //     <CircularProgress />
                    //   </div> 
                    //   : <></>
                    //   }
                  >
                    {userRecipes.map((recipe) => (
                      <ProfileRecipeCard
                        key={recipe.recipe_id}
                        recipe={recipe}
                        userRecipes={userRecipes} 
                        setUserRecipes={setUserRecipes}
                      />
                    ))}
                  </InfiniteScroll>
                  { userRecipes.length === 0 && 
                    <div className="text-center">
                      <h3>No recipes found</h3>
                    </div>
                  }
                  { isLoading &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <CircularProgress />
                    </div> 
                  }
              </div>
          </div>
        </div>
      : 
      <NotAuthorized />
      }
    </div>
   );
}
 
export default Profile;