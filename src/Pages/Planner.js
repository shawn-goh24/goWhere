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
import LeftCol from "./Planner/LeftCol";

export default function Planner(props) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [open, setOpen] = useState(true);
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [interest, setInterest] = useState({});

  const handleDetails = (name, add, lat, lng) => {
    // setLocation(name);
    // setAddress(add);
    // setLat(lat);
    // setLng(lng);
    const tmp = {
      name: name,
      address: add,
      lat: lat,
      lng: lng,
    };
    setInterest(tmp);
  };

  // console.log(interest);

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}
          // sx={{ backgroundColor: "coral" }}
        >
          {/* <NavBar /> */}
          <LeftCol interest={interest} />
          {/* <SearchBox id="autocomplete" />
          <Button>Add</Button> */}
        </Grid>
        <Grid item md={6}>
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
            handleDetails={handleDetails}
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
