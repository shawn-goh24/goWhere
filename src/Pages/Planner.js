import React, { useState } from "react";
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

export default function Planner(props) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [open, setOpen] = useState(true);

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={6} sx={{ padding: "20px" }}>
          <NavBar />
          <SearchBox />
        </Grid>
        <Grid item md={6}>
          <Map
            id="GoogleMap"
            options={{
              center: { lat: 41.0082, lng: 28.9784 },
              zoom: 8,
            }}
            loading={open}
            setMapLoaded={setMapLoaded}
            openBackDrop={setOpen}
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
