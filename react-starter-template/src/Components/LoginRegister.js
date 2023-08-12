import React, { useState } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { setToken } from "../utils/helper";
import { BASE_URL } from "../utils/helper";
const maxSize = 5 * 1024 * 1024; 
export default function LoginRegister() {
  const { setIsLoggedIn} = useContext(UserContext);
  const [justifyActive, setJustifyActive] = useState("tab1");
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName:"",
    lastName:"",
    email: "",
    password: "",
    profilePicture:null,
    birthDate:"",
    phoneNumber:"",
  });

  
  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
  
    if(name == "profilePicture")
    {
      const filevalue = e.target.files[0]; 
      setFormData((prevFormData) => ({ ...prevFormData, [name]: filevalue}));
      return;
    }
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
 
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

   
    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!passwordPattern.test(formData.password)) {
      alert(
        "Password must be >6 and contain at least one uppercase char, one lowercase char, and one special char"
      );
      return;
    }

      try {
        const response = await axios.post(`${BASE_URL}/login`, formData);
        alert("Login successful:");
        setToken(response.data.token)
        setIsLoggedIn(true)
        navigate('/')
      } catch (error) {
        alert("Invalid User");
      }
    
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const namePattern = /^[a-zA-Z]+ ?[a-zA-Z]+$/;
    const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    const phonePattern=/[0-9]{10}/;

  
    if (!formData.firstName || !namePattern.test(formData.firstName) || formData.firstName.length > 10) {
      alert("Please enter a valid firstname containing only alphabets and maximum 10 length");
      return;
    }
    if (!formData.lastName || !namePattern.test(formData.lastName) || formData.lastName.length > 10) {
      alert("Please enter a valid lastname containing only alphabets and maximum 10 length");
      return;
    }

    if (!formData.email ||!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!formData.password ||!passwordPattern.test(formData.password)) {
      alert(
        "Password must be >6 and contain at least one uppercase char, one lowercase char, and one special char"
      );
      return;
    }

    if (!formData.phoneNumber || !phonePattern.test(formData.phoneNumber)) {
      alert("Please enter a valid mobile number");
      return;
    }
    
    if(!formData.profilePicture || !formData.profilePicture.type.startsWith("image/") || formData.profilePicture.size > maxSize)
    {
      alert("Please enter a valid profile picture  which is less than 5 mb");
      return;
    }
    
    const selectedBirthDate = new Date(formData.birthDate);
    const currentDate = new Date();

    if(!formData.birthDate || selectedBirthDate >= currentDate)
    {
      alert("Please enter a valid birthdate");
      return;
    }


      try {
        const response = await axios.post(`${BASE_URL}/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Registration successful:");
        setToken(response.data.token);
        setIsLoggedIn(true)
         navigate('/')
      }
       catch (error) {
        alert("User is already register")
        console.error("Registration failed:", error.message);
      }
    
    
   
  };



  return (
    <MDBContainer breakpoint="sm" className="p-3 my-5 d-flex flex-column">
      <MDBRow center>
        <MDBCol size='5'>
          <MDBTabs
            pills
            justify
            className="mb-3 d-flex flex-row justify-content-between"
          >
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleJustifyClick("tab1")}
                active={justifyActive === "tab1"}
              >
                Login
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleJustifyClick("tab2")}
                active={justifyActive === "tab2"}
              >
                Register
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            <MDBTabsPane show={justifyActive === "tab1"}>
              <form onSubmit={handleLoginSubmit}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email address"
                  id="form1"
                  type="email"
                  name="email"
                  value={formData.email}
                  required
                  onChange={handleFormChange}

                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  id="form2"
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleFormChange}



                />

                <MDBBtn className="mb-4 w-100" type="submit">
                  Sign in
                </MDBBtn>
              </form>
            </MDBTabsPane>

            <MDBTabsPane show={justifyActive === "tab2"}>
              <form onSubmit={handleRegisterSubmit}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Firstname"
                  id="form1"
                  type="text"
                  name="firstName"
                  value={formData.firstNameame}
                  required
                  onChange={handleFormChange}

                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Lastname"
                  id="form1"
                  type="text"
                  name="lastName"
                  value={formData.lastNameNameame}
                  required
                  onChange={handleFormChange}

                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  id="form2"
                  type="email"
                  name="email"
                  value={formData.email}
                  required
                  onChange={handleFormChange}

                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  id="form4"
                  type="password"
                  name="password"
                  value={formData.password}
                  required
                  onChange={handleFormChange}

                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Profileicture"
                  id="form3"
                  type="file"
                  name="profilePicture"
                  required
                  // value={formData.profilePicture}
                  onChange={handleFormChange}

                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Birthdate"
                  id="form3"
                  type="date"
                  name="birthDate"
                  required
                  value={formData.birthDate}
                  onChange={handleFormChange}

                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Phonenumber"
                  id="form3"
                  type="number"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleFormChange}

                />
                

                <MDBBtn className="mb-4 w-100" type="submit">
                  Sign up
                </MDBBtn>
              </form>
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

