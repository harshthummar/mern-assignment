import  React,{useContext} from "react"
import LoginRegister from "../Components/LoginRegister";
import Home from "../Components/Home";
import PageNotFound from "../Components/PageNotFound";
import { UserContext } from "../UserContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../Components/NavbarC"
import MathQuiz from "../Components/MathQuize";

const AppRoutes = () => {
  const { isLoggedIn} = useContext(UserContext);
  return (
    <>
      <BrowserRouter>
            <Navbar></Navbar>
            
            <Routes>
            
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<MathQuiz />} />
                <Route path="*" element={<PageNotFound/>} />
              </>
            ) : (
              <>
                  <Route path="/" element={<LoginRegister />} />
                  <Route path="*" element={<PageNotFound/>} />
              </>
              
            )}

          </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
