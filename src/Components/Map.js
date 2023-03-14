import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Paper,
  Backdrop,
  CircularProgress,
} from "@mui/material";

export default function Map(props) {
  const [markers, setMarkers] = useState([]);
  const [checkCount, setCheckCount] = useState(0);
  let timeOut;
  // Function to generate a map after the script tag is added into the head
  const onScriptLoad = () => {
    console.log("Start of onscript load");
    const mapId = document.getElementById(props.id);
    const map = new window.google.maps.Map(mapId, props.options);
    map.setCenter(props.mapViewBound);
    //map.fitBounds(props.mapViewBound);
    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById(props.inputId),
      {
        types: ["establishment"],
        fields: ["place_id", "geometry", "name"],
      }
    );
    // const searchBox = new window.google.maps.places.SearchBox(
    //   document.getElementById(props.inputId)
    // );

    autocomplete.addListener("place_changed", (e) => {
      onPlaceChanged(autocomplete, map, markers);
    });
    console.log("End of onscript load");
  };

  const onPlaceChanged = (autocomplete, map, markers) => {
    let place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      setMarkers([
        ...markers,
        new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
        }),
      ]);
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  };

  const stopLoading = () => {
    props.setMapLoaded(true);
    props.openBackDrop(false);
    clearTimeout(timeOut);
  };

  // Function to check if Google Maps has been loaded
  // const checkMapLoaded = () => {
  //   setCheckCount(checkCount + 1);
  //   console.log(checkCount);
  //   if (!window.google) {
  //     if (checkCount > 20) {
  //       console.log("I am inside checkcount");
  //       alert("Google Maps loading issue, please refresh page");
  //       setCheckCount(0);
  //       return false;
  //     } else {
  //       console.log("I am inside timeout");
  //       timeOut = setTimeout(checkMapLoaded, 100);
  //       console.log("Map not loaded");
  //     }
  //   } else {
  //     // onScriptLoad();
  //     // console.log("Map Loaded");
  //     //console.log(window.google);
  //     console.log("Map Loaded 1");
  //     return true;
  //   }
  // };

  const checkWindowGoogleLoaded = () => {
    if (window.google) {
      return true;
    } else {
      return false;
    }
  };

  const checkMapLoaded = () => {
    let isWindowGoogleLoaded = false;
    let count = 0;

    while (!isWindowGoogleLoaded) {
      console.log(isWindowGoogleLoaded);
      isWindowGoogleLoaded = checkWindowGoogleLoaded();
      count += 1;
      //console.log(count);
      // if (count > 5000) {
      //   return false;
    }

    return true;
  };

  useEffect(() => {
    if (checkMapLoaded()) {
      console.log("I am inside useEffect if");
      onScriptLoad();
      timeOut = setTimeout(stopLoading, 3000);
      //stopLoading();
      console.log("Map Loaded 2");
    } else {
      alert("Google Maps loading error, please go to home page");
    }
  }, []);

  return (
    <>
      <div style={{ width: "100%", height: "100vh" }} id={props.id} />
    </>
  );
}
