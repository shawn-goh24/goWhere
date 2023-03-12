import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import NavBar from "./Components/NavBar";
import NotFound from "./Pages/NotFound";
import Index from "./Pages/Home/Home";
import { Login } from "./Pages/Home/Login";
import { Signup } from "./Pages/Home/Signup";
import Profile from "./Pages/Profile";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Protected from "./Components/Protected";

// Add react router and authentication here

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });
  }, []);

  // change isLogin/isSignup state when click
  const handleDialog = (event) => {
    try {
      if (event.target.name === "login") {
        setIsLogin(!isLogin);
      } else if (
        event.target.innerText &&
        (event.target.name === "signup" ||
          event.target.innerText.toLowerCase() === "signup")
      ) {
        if (isLogin) {
          setIsLogin(!isLogin);
        }
        setIsSignup(!isSignup);
      } else {
        setIsLogin(false);
        setIsSignup(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginDialog = (event) => {
    setIsLogin(!isLogin);
  };

  const handleSignupDialog = (event) => {
    if (isLogin) {
      setIsLogin(!isLogin);
    }
    setIsSignup(!isSignup);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Logout");
        setUser("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <NavBar
              user={user}
              handleLogin={handleLoginDialog}
              handleSignup={handleSignupDialog}
              handleLogout={handleLogout}
            />
          }
        />
      </Routes>
      <Routes>
        <Route path="/" element={<Index user={user} />} />
        <Route
          path="/user/:id"
          element={
            <Protected isSignedIn={user}>
              <Profile user={user} />
            </Protected>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Login
        isOpen={isLogin}
        handleDialog={handleDialog}
        handleLoginDialog={handleLoginDialog}
      />
      <Signup isOpen={isSignup} handleDialog={handleSignupDialog} />
    </>
  );
}

export default App;
