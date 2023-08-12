import React,{useContext} from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from '../UserContext';
import { getToken, removeToken } from '../utils/helper';
import { Link } from 'react-router-dom';
import { BASE_URL } from "../utils/helper";

export default function NavbarC() {
  const navigate = useNavigate();
  const { isLoggedIn ,setIsLoggedIn} = useContext(UserContext);

  const handleLogout = async () => {
    const authToken = getToken();
    if(authToken)
    {
      try {
      
        await axios.post(`${BASE_URL}/logout`, null, {
          headers: {
            "Authorization": `Bearer ${authToken}`
          },
        });
        alert("Logout Successfully.")
        removeToken()
        setIsLoggedIn(false);
        navigate("/");
      } catch (error) {
          alert("Logout failed:");
      }
    }
    else{
      alert("For authentication token must be require")
    }
   
    
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">MERN App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
         
            {
             
                isLoggedIn ? (
                  <> 
                      <Link to="/" className="nav-link">Home</Link>
                      <Nav.Link onClick={handleLogout}>SignOut</Nav.Link>
                  </>
                ):null
                
            }
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
