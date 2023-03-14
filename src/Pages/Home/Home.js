import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  Paper,
  TextField,
  Input,
  Typography,
  Autocomplete,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventNoteIcon from "@mui/icons-material/EventNote";
import React, { useState, useMemo } from "react";
import hero from "../../Assets/hero-1920x890.png";
import paris from "../../Assets/paris.jpg";
import "./Home.css";
import countryList from "react-select-country-list";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { auth, database } from "../../firebase";
import { set, ref, push, update } from "firebase/database";

import { useNavigate } from "react-router-dom";

const DB_TRIPS_KEY = "trips";
const DB_USERS_KEY = "users";

export default function Home(props) {
  const [location, setLocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState(0);
  const options = useMemo(() => countryList().getData(), []);

  const navigate = useNavigate();

  // check if screen is small
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // console.log(isSmallScreen);

  // console.log("location: " + location);
  // console.log("start date: " + startDate);
  // console.log("end date: " + endDate);
  // console.log("budget: " + budget);

  const planNow = () => {
    if (!auth.currentUser) {
      return alert("Not logged in, please sign up");
    }
    addTrip(location).then((tripId) => {
      console.log("Create new trip");
      navigate(`/planner/${tripId}`);
    });
  };

  // Function to get geolocation and add trip to database
  const addTrip = (country) => {
    const google = window.google;
    let geocoder = new google.maps.Geocoder();

    return geocoder
      .geocode({ address: country })
      .then((result) => {
        const { results } = result;
        const { lat, lng } = JSON.parse(
          JSON.stringify(results[0].geometry.location)
        );
        // const bound = results[0].geometry.viewport;
        const bound = { lat: lat, lng: lng };
        return [lat, lng, bound];
      })
      .then(([lat, lng, bound]) => {
        const tripsRef = ref(database, DB_TRIPS_KEY);
        const newTripRef = push(tripsRef);
        const tripId = newTripRef.key;

        const trip = {
          country: location,
          startDate: startDate,
          endDate: endDate,
          budget: budget,
          creatorName: props.user.displayName,
          creatorId: props.user.uid,
          locationLat: lat,
          locationLng: lng,
          mapViewBound: bound,
          tripId: tripId,
        };
        set(newTripRef, trip);
        props.setTripGeolocation({ lat: lat, lng: lng });
        props.setMapViewBound(bound);

        return tripId;

        // Add Trips to user
        // const userRef = ref(
        //   database,
        //   `${DB_USERS_KEY}/${props.user.uid}/trips`
        // );
        // const updatedTrip = { [tripId]: true };
        // update(userRef, updatedTrip);
      })
      .catch((e) => {
        console.log(
          "addTrip was not successful for the following reason: " + e
        );
      });
  };

  return (
    <>
      <Container name="hero">
        <img
          src={hero}
          alt="hero"
          width="100%"
          style={{ borderRadius: "30px" }}
        />
        <Paper
          elevation={8}
          sx={{
            display: "flex",
            justifyContent: "space-around",
            p: "25px 10px",
            m: "0px 5%",
            position: "relative",
            top: "-55px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <FmdGoodIcon sx={{ color: "#77a690" }} />
                <Autocomplete
                  options={options}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: "215px" }}
                      variant="standard"
                      {...params}
                      label="Select Country"
                    />
                  )}
                  onChange={(event, newValue) => {
                    try {
                      setLocation(
                        JSON.stringify(newValue["label"]).replace(/["]/g, "")
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
              </Box>
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item>
              <Box sx={{ color: "#77a690" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Start Date"
                    sx={{ width: "175px", mr: "5px" }}
                    onChange={(date) =>
                      setStartDate(date["$d"].toLocaleDateString())
                    }
                  />
                  <DesktopDatePicker
                    label="End Date"
                    sx={{ width: "175px" }}
                    onChange={(date) =>
                      setEndDate(date["$d"].toLocaleDateString())
                    }
                  />
                </LocalizationProvider>
              </Box>
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <AttachMoneyIcon sx={{ color: "#77a690" }} />
                <FormControl>
                  <Input
                    placeholder="Budget"
                    id="standard-adornment-amount"
                    type="number"
                    onChange={(event) => setBudget(event.target.value)}
                    sx={{ width: "175px" }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item>
              <Button
                className="btn-green"
                variant="contained"
                size="small"
                onClick={planNow}
              >
                Plan Now
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Box name="plan-share-choose" sx={{ backgroundColor: "#F2F2F2" }}>
        <Container maxWidth="lg">
          <Grid
            container
            minHeight={300}
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item>
              <Box sx={{ width: "205px" }}>
                <EventNoteIcon
                  sx={{ width: "70px", height: "70px", color: "#77a690" }}
                />
                <Typography variant="h5" sx={{ fontWeight: "700" }}>
                  PLAN YOUR MOVE
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ width: "205px" }}>
                <EventNoteIcon
                  sx={{ width: "70px", height: "70px", color: "#77a690" }}
                />
                <Typography variant="h5" sx={{ fontWeight: "700" }}>
                  SHARE THE ADVENTURE
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ width: "205px" }}>
                <EventNoteIcon
                  sx={{ width: "70px", height: "70px", color: "#77a690" }}
                />
                <Typography variant="h5" sx={{ fontWeight: "700" }}>
                  CHOOSE YOUR DESTINY
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box name="destination">
        <Container maxWidth="lg">
          <Grid
            container
            minHeight={500}
            direction="column"
            alignItems="center"
            justifyContent="space-around"
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <div className="line" />
                <Typography variant="h4">Destination</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {isSmallScreen ? (
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <img src={paris} alt="paris" className="destination" />
                  </Grid>
                  <Grid item>
                    <img src={paris} alt="paris" className="destination" />
                  </Grid>
                  <Grid item>
                    <img src={paris} alt="paris" className="destination" />
                  </Grid>
                </Grid>
              ) : (
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <img src={paris} alt="paris" className="destination" />
                  </Grid>
                  <Grid item>
                    <img src={paris} alt="paris" className="destination" />
                  </Grid>
                  <Grid item>
                    <img src={paris} alt="paris" className="destination" />
                  </Grid>
                  <Grid item>
                    <img src={paris} alt="paris" className="destination" />
                  </Grid>
                  <Grid item>
                    <img src={paris} alt="paris" className="destination" />
                  </Grid>
                </Grid>
              )}
            </Box>
            <Box>
              <Typography variant="h5">And many more ...</Typography>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Box name="footer" className="layout" sx={{ backgroundColor: "#F2F2F2" }}>
        <Typography variant="subtitle2">FOR PROJECT PURPOSE ONLY</Typography>
      </Box>
    </>
  );
}
