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

export default function Planner(props) {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={6} sx={{ padding: "20px" }}>
          <NavBar />
        </Grid>
        <Grid item md={6}>
          <Map
            id="GoogleMap"
            options={{
              center: { lat: 41.0082, lng: 28.9784 },
              zoom: 8,
            }}
            loading={true}
            setMapLoaded={setMapLoaded}
          />
        </Grid>
      </Grid>
    </>
  );
}
