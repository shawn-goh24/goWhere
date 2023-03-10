import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Paper,
  Backdrop,
  CircularProgress,
} from "@mui/material";

export default function Map(props) {
  // Function to generate a map after the script tag is added into the head
  const onScriptLoad = () => {
    const mapId = document.getElementById(props.id);
    const map = new window.google.maps.Map(mapId, props.options);
  };

  // Function to check if the script tag is already in the head
  const isLoaded = (scripts) => {
    for (const script of scripts) {
      if (script.id === "google-maps") {
        return true;
      }
    }
    return false;
  };

  const stopLoading = () => {
    props.setMapLoaded(true);
    props.openBackDrop(false);
  };

  // Function to check if Google Maps script has been added to head tag
  const addScript = () => {
    // Create a script tag
    let script = document.createElement("script");
    // script.async = true;
    script.type = "text/javascript";
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      process.env.REACT_APP_MAPS_API +
      "&callback=stopLoading";
    // Assign id to the script tag so that
    // it can be used to check if this script tag has been added previously
    script.id = "google-maps";

    // React can't find the callback function
    // Use the window variable to access the function name and assign the function to it
    window.stopLoading = stopLoading;

    // Get the first script tag in the browser
    let scriptElement = document.getElementsByTagName("script")[0];

    // Insert the script tag into head
    scriptElement.parentNode.insertBefore(script, scriptElement);

    // Add event listener to the script tag
    // Once the script tag is loaded into head,
    // run the onSrcipLoad function
    script.addEventListener("load", (e) => {
      onScriptLoad();
    });
  };

  // Function to check if Google Maps has been loaded
  const checkMapLoaded = () => {
    if (!window.google) {
      setTimeout(checkMapLoaded, 100);
      console.log("Map not loaded");
    } else {
      onScriptLoad();
      console.log("Map Loaded");
      return true;
    }
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
    } else {
      if (checkMapLoaded()) {
        stopLoading();
      }
    }
  }, []);

  return (
    <>
      <div style={{ width: "100%", height: "100vh" }} id={props.id} />
    </>
  );
}
