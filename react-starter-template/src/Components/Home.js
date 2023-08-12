import React, { useEffect, useState } from 'react';
import { BASE_URL, getToken } from '../utils/helper';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Home(){
  const [showWelcome, setShowWelcome] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName:'',
    profilePicture: '',
  });
  const navigate = useNavigate();
  const handleStartClick = () => {
    navigate('/quiz'); 
  };

  useEffect(() => {

    const fetchUserProfile = async () => {
      const authToken = getToken();
        if (authToken) {
              try {
                const headers = { Authorization: `Bearer ${authToken}` };
                let url = `${BASE_URL}/profile`;
                const response = await axios.get(url, {
                  headers,
                });
                const data = response.data;
                setUserProfile(data);
              } catch (error) {
                console.error("Error fetching user profile:", error.message);
              }
      } 
      else 
      {
        alert("For authentication token must be require");
      }
    }  
    fetchUserProfile();
    const timer = setTimeout(() => {
      setShowWelcome(true);
      
    }, 500);

    return () => clearTimeout(timer);
  },[]);
  
  return (
    <div className="home-container">
      <div className="background-image" />
      {showWelcome && (
        
            <div className="welcome-message">
              <h1>Welcome to Our App</h1>
              <div className="profile-picture">
                <img src={`${BASE_URL}/${userProfile.profilePicture}`} alt="Profile" />
                <p>{userProfile.firstName} {userProfile.lastName}</p>
              </div>
              <button onClick={handleStartClick}>Start Quiz</button>
            </div>
            
        
      )}
    </div>
  );
};


