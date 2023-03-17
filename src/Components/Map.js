import { onValue, ref } from "firebase/database";
import React, { useState, useEffect } from "react";
import { database } from "../firebase";

export default function Map(props) {
  const [markers, setMarkers] = useState([]);

  const { handleDetails } = props;

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
        fields: ["place_id", "geometry", "name", "formatted_address"],
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

    handleDetails(
      place.name,
      place.formatted_address,
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );

    // If the place has a geometry, then present it on a map.
    // if (place.geometry.viewport) {
    //   setMarkers([
    //     ...markers,
    //     new window.google.maps.Marker({
    //       position: place.geometry.location,
    //       map: map,
    //     }),
    //   ]);
    //   map.fitBounds(place.geometry.viewport);
    // } else {
    //   map.setCenter(place.geometry.location);
    //   map.setZoom(17);
    // }
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

      const mapId = document.getElementById(props.id);
      const map = new window.google.maps.Map(mapId, props.options);
      let bounds = new window.google.maps.LatLngBounds();
      const placesRef = ref(database, `trips/${props.trip}/places`);
      onValue(placesRef, (data) => {
        Object.values(data.val()).forEach((item) => {
          let marker = new window.google.maps.Marker({
            position: { lat: item.lat, lng: item.lng },
            map,
          });

          bounds.extend(marker.position);
        });
        map.fitBounds(bounds);
      });
    } else {
      props.setModalOpen(true);
    }
  }, []);

  return (
    <>
      <div
        style={{ width: "100%", height: "calc(100vh - 64px)" }} // original height 100vh
        id={props.id}
      />
    </>
  );
}
