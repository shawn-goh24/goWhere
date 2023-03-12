import React, { useState, useRef, forwardRef } from "react";
import {
  Grid,
  Container,
  Paper,
  Backdrop,
  CircularProgress,
  Button,
} from "@mui/material";
import NavBar from "../Components/NavBar";
import Map from "../Components/Map";
import TestMap from "../Components/TestMap";
import SearchBox from "../Components/SearchBox";
import SideBar from "../Components/SideBar";

export default function Planner(props) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [open, setOpen] = useState(true);

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={5} sx={{ padding: "20px" }}>
          {/* <NavBar /> */}
          {/* <SideBar /> */}
          <SearchBox id="autocomplete" />
          <Button>Add</Button>
        </Grid>
        <Grid item md={7}>
          <TestMap
            id="GoogleMap"
            options={{
              center: { lat: 1.29027, lng: 103.851959 },
              zoom: 15,
            }}
            location={{ lat: 1.29027, lng: 103.851959 }}
            loading={open}
            setMapLoaded={setMapLoaded}
            openBackDrop={setOpen}
            inputId="autocomplete"
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
