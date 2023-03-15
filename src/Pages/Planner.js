import React, { useState, useRef, forwardRef, useEffect } from "react";
import {
  Grid,
  Container,
  Paper,
  Backdrop,
  CircularProgress,
  Button,
  Modal,
  Box,
  Typography,
} from "@mui/material";

import Map from "../Components/Map";
import TestMap from "../Components/TestMap";
import SearchBox from "../Components/SearchBox";
import SideBar from "../Components/SideBar";
import LeftCol from "./Planner/LeftCol";

import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Planner(props) {
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
  const [modalOpen, setModalOpen] = useState(false);

  // If Google Maps script tag is not found,
  // add script tag in head
  useEffect(() => {
    if (!props.mapLoaded) {
      props.addScript();
    }
  });

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    setModalOpen(false);
  };

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/`);
  };

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
          {props.mapLoaded && (
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
              openBackDrop={setOpen}
              inputId="autocomplete"
              mapViewBound={props.mapViewBound}
              setModalOpen={setModalOpen}
            />
          )}

          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Grid>
      </Grid>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Google Maps Loading Error
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Page refresh is not support, please access the trip via home page.
          </Typography>
          <Button
            onClick={handleClick}
            sx={{ mt: 2 }}
            variant="contained"
            className="btn-green"
          >
            Proceed to Home
          </Button>
        </Box>
      </Modal>
    </>
  );
}
