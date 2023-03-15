import React, { useState, useEffect } from "react";

export default function Map(props) {
  const [markers, setMarkers] = useState([]);

  if (markers.length !== 0) {
    console.log(markers);
    console.log("Lat: " + markers[0].position.lat());
    console.log("Lng: " + markers[0].position.lng());
  }

  //const [checkCount, setCheckCount] = useState(0);
  let timeOut;
  // Function to generate a map after the script tag is added into the head
  const onScriptLoad = () => {
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
    autocomplete.addListener("place_changed", (e) => {
      onPlaceChanged(autocomplete, map, markers);
    });
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
    //props.setMapLoaded(true);
    props.openBackDrop(false);
    clearTimeout(timeOut);
  };

  // Function to check if Google Maps has been loaded
  const checkWindowGoogleLoaded = () => {
    if (window.google) {
      return true;
    } else {
      return false;
    }
  };

  // Function to check if Google Maps has been loaded
  const checkMapLoaded = () => {
    let isWindowGoogleLoaded = false;
    let count = 0;

    while (!isWindowGoogleLoaded && count < 5000) {
      isWindowGoogleLoaded = checkWindowGoogleLoaded();
      count += 1;
    }

    if (isWindowGoogleLoaded) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (checkMapLoaded()) {
      console.log("window.google is found");
      onScriptLoad();
      timeOut = setTimeout(stopLoading, 2000);
    } else {
      props.setModalOpen(true);
    }
  }, []);

  return (
    <>
      <div style={{ width: "100%", height: "100vh" }} id={props.id} />
    </>
  );
}
