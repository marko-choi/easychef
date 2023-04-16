import React from 'react';
import './profile.css';
import ProfileCard from './components/ProfileCard';
import axios from 'axios';
import { useState, useEffect } from 'react';
import NotAuthorized from '../Error/NotAuthorized';

const EditProfile = ({ isAuth, setIsAuth }) => {  
  const [profileInformation, setProfileInformation] = useState({});
  
    const getUserProfile = () => {
      axios.get('http://localhost:8000/auth/viewprofile/')
        .then((res) => {
          // console.log(res.data);
          let data = res.data
          let info = {
            ...res.data,
            name: data.first_name + ' ' + data.last_name,
            phone: data.phone_number
          }
          if (info.avatar) {
            info.avatar = 'http://localhost:8000' + info.avatar;
          }
          setProfileInformation(info);
        });
    }

  useEffect(() => {
    // if (!isAuth) {
    //   navigate('/');
    // };

    getUserProfile();
  }, [])

  return ( 
  <div id="profile">
    { isAuth ?
      <div className="container pt-3">
      <ProfileCard 
        profileInformation={profileInformation} 
        setProfileInformation={setProfileInformation}
        mode={"edit"}
        />
      </div>
      :
      <NotAuthorized />
    }
  </div>
  );
}
 
export default EditProfile;