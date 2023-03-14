import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import NavBar from "./Components/NavBar";
import NotFound from "./Pages/NotFound";
import Index from "./Pages/Home/Home";
import { Login } from "./Pages/Home/Login";
import { Signup } from "./Pages/Home/Signup";
import Profile from "./Pages/Profile";
import { auth, database } from "./firebase";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Protected from "./Components/Protected";
import Planner from "./Pages/Planner";
import { findTrips } from "./utils";

// Add react router and authentication here

const DB_TRIPS_KEY = "trips";
const DB_USERS_KEY = "users";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState("");
  const [userTrips, setUserTrips] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [tripGeolocation, setTripGeolocation] = useState({});
  const [mapViewBound, setMapViewBound] = useState("");

  // useEffect that run only once when component mount
  useEffect(() => {
    //Track user's login status
    onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });
  }, []);

  // useEffect that runs every time the user changes
  // to add newly created trips
  useEffect(() => {
    // Create reference to trips database
    const tripsRef = ref(database, DB_TRIPS_KEY);
    onValue(tripsRef, (data) => {
      const allTrips = data.val();
      const newUserTrips = findTrips(allTrips, user.uid);
      setUserTrips(newUserTrips);
    });
  }, [user]);

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

  // Function to check if the script tag is already in the head
  const isLoaded = (scripts) => {
    for (const script of scripts) {
      if (script.id === "google-maps") {
        setMapLoaded(true);
        return true;
      }
    }
    setMapLoaded(false);
    return false;
  };

  // Function to check if Google Maps script has been added to head tag
  const addScript = () => {
    // Create a script tag
    let script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";

    // Google Map requires a callback function to be defined in the script,
    // Create script tag and include a noop function as the callback
    // as we do not require any callback to be done once script is loaded
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      process.env.REACT_APP_MAPS_API +
      "&libraries=places&callback=Function.prototype";

    // Assign id to the script tag so that
    // it can be used to check if this script tag has been added previously
    script.id = "google-maps";

    // Get the first script tag in the browser
    let scriptElement = document.getElementsByTagName("script")[0];

    // Insert the script tag into head
    scriptElement.parentNode.insertBefore(script, scriptElement);

    setMapLoaded(true);
  };

  useEffect(() => {
    // get all script tags
    const allScripts = document.getElementsByTagName("script");

    // Check if Google Maps script tag is in the head
    // If yes, Google Maps is loaded
    const loaded = isLoaded(allScripts);

    // If Google Maps script tag is not found,
    // Add the script tag into the head
    if (!loaded) {
      addScript();
    }
  }, []);

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
        <Route
          path="/"
          element={
            <Index
              user={user}
              setTripGeolocation={setTripGeolocation}
              setMapViewBound={setMapViewBound}
            />
          }
        />
        <Route
          path="/user/:id"
          element={
            <Protected isSignedIn={user}>
              <Profile
                user={user}
                trips={userTrips}
                setTripGeolocation={setTripGeolocation}
                setMapViewBound={setMapViewBound}
              />
            </Protected>
          }
        />
        <Route
          path="/planner/:trip"
          element={
            <Protected isSignedIn={user}>
              <Planner
                tripGeolocation={tripGeolocation}
                mapViewBound={mapViewBound}
                mapLoaded={mapLoaded}
                addScript={addScript}
              />
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
