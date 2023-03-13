import React, { useState, useRef, forwardRef, useEffect } from "react";
import {
  Grid,
  Container,
  Paper,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import NavBar from "../Components/NavBar";
import Map from "../Components/Map";
import SearchBox from "../Components/SearchBox";
import SideBar from "../Components/SideBar";

export default function Planner(props) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [open, setOpen] = useState(true);

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={6} sx={{ padding: "20px" }}>
          <NavBar />
          {/* <SideBar /> */}
          <SearchBox id="autocomplete" />
        </Grid>
        <Grid item md={6}>
          <Map
            id="GoogleMap"
            options={{
              center: {
                lat: props.tripGeolocation.lat,
                lng: props.tripGeolocation.lng,
              },
              zoom: 12,
            }}
            loading={open}
            setMapLoaded={setMapLoaded}
            openBackDrop={setOpen}
            inputId="autocomplete"
            mapViewBound={props.mapViewBound}
          />
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Grid>
      </Grid>
    </>
  );
}
