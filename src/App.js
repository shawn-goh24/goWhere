import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import NavBar from "./Components/NavBar";
import Index from "./Pages/Home/Home";
import { Login } from "./Pages/Home/Login";
import { Signup } from "./Pages/Home/Signup";
import Profile from "./Pages/Profile";

// Add react router and authentication here

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // change isLogin/isSignup state when click
  const handleDialog = (event) => {
    try {
      if (event.target.name === "login") {
        setIsLogin(!isLogin);
      } else if (
        event.target.name === "signup" ||
        event.target.innerText.toLowerCase() === "signup"
      ) {
        if (isLogin) {
          setIsLogin(!isLogin);
        }
        setIsSignup(!isSignup);
      }
    } catch (error) {
      console.log("Error on handleDialog");
    }
  };

  return (
    <>
      <Routes>
        <Route path="/*" element={<NavBar handleDialog={handleDialog} />} />
      </Routes>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Profile />} />
      </Routes>
      <Login isOpen={isLogin} handleDialog={handleDialog} />
      <Signup isOpen={isSignup} handleDialog={handleDialog} />
    </>
  );
}

export default App;
