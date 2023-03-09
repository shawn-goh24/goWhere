import React, { useState, useEffect } from "react";
import { Grid, Container, Paper } from "@mui/material";
import NavBar from "../Components/NavBar";

export default function Map(props) {
  const onScriptLoad = () => {
    const mapId = document.getElementById(props.id);
    const map = new window.google.maps.Map(mapId, props.options);
  };

  useEffect(() => {
    debugger;
    console.log(window);
    if (window.google) {
      onScriptLoad();
    } else {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        process.env.REACT_APP_MAPS_API;

      let x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(script, x);

      script.addEventListener("load", (e) => {
        onScriptLoad();
      });
    }
  }, []);

  return (
    <>
      <div style={{ width: "100%", height: "100vh" }} id={props.id} />
    </>
  );
}
