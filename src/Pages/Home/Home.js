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
import React, { useState, useMemo, useEffect } from "react";
import hero from "../../Assets/hero-1920x890.png";
import paris from "../../Assets/paris.jpg";
import "./Home.css";
import countryList from "react-select-country-list";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { createApi } from "unsplash-js";

import { auth, database } from "../../firebase";
import { set, ref, push, update } from "firebase/database";

import { useNavigate } from "react-router-dom";

const DB_TRIPS_KEY = "trips";

const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_KEY,
});

export default function Home(props) {
  const [location, setLocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState(0);
  const [sampleImg, setSampleImg] = useState([]);
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

  const planNow = (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      return alert("Not logged in, please sign up");
    }
    if (!startDate || !endDate) {
      alert("Missing entry! \nSelect start or end date");
      return "";
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

        unsplash.search
          .getPhotos({
            query: location,
            page: 1,
            perPage: 10,
            orientation: "landscape",
          })
          .then((coverImgUrl) => {
            console.log(coverImgUrl.response.results[0].urls.regular);
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
              creatorEmail: props.user.email,
              coverImgUrl: coverImgUrl.response.results[0].urls.regular,
            };
            set(newTripRef, trip);
            props.setTripGeolocation({ lat: lat, lng: lng });
            props.setMapViewBound(bound);
          });
        return tripId;
      })
      .catch((e) => {
        console.log(
          "addTrip was not successful for the following reason: " + e
        );
      });
  };

  const onDateChange = (date) => {
    const newMonth = date["$M"] + 1;
    const newDate = `${date["$D"]}/${newMonth}/${date["$y"]}`;
    return newDate;
  };

  useEffect(() => {
    unsplash.search
      .getPhotos({
        query: "top places in the world",
        page: 1,
        perPage: 10,
        orientation: "landscape",
      })
      .then((result) => {
        setSampleImg(result.response.results);
      });
  }, []);

  console.log(sampleImg);

  return (
    <>
      <Container name="hero">
        <img
          src={hero}
          alt="hero"
          width="100%"
          style={{ borderRadius: "30px" }}
        />
        {isSmallScreen ? (
          <Paper
            elevation={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: "25px 10px",
              m: "0px 10%",
              position: "relative",
              top: "-55px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <form onSubmit={planNow} style={{ width: "100%" }}>
              <Grid
                container
                direction="column"
                justifyContent="center"
                textAlign="center"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* <FmdGoodIcon sx={{ color: "#77a690" }} /> */}
                    <Autocomplete
                      options={options}
                      renderInput={(params) => (
                        <TextField
                          required
                          sx={{ width: "215px" }}
                          variant="standard"
                          {...params}
                          label="Select Country"
                        />
                      )}
                      onChange={(event, newValue) => {
                        try {
                          setLocation(
                            JSON.stringify(newValue["label"]).replace(
                              /["]/g,
                              ""
                            )
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
                  <Box
                    sx={{
                      color: "#77a690",
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Start Date"
                        sx={{ width: "175px", mb: 1 }}
                        onChange={(date) => setStartDate(onDateChange(date))}
                      />
                      <DesktopDatePicker
                        label="End Date"
                        sx={{ width: "175px" }}
                        onChange={(date) => setEndDate(onDateChange(date))}
                      />
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item>
                  <Button
                    className="btn-green"
                    variant="contained"
                    size="small"
                    type="submit"
                  >
                    Plan Now
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        ) : (
          <Paper
            elevation={8}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              p: "25px 10px",
              m: "0px 10%",
              position: "relative",
              top: "-55px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <form onSubmit={planNow} style={{ width: "100%" }}>
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
                          required
                          sx={{ width: "215px" }}
                          variant="standard"
                          {...params}
                          label="Select Country"
                        />
                      )}
                      onChange={(event, newValue) => {
                        try {
                          setLocation(
                            JSON.stringify(newValue["label"]).replace(
                              /["]/g,
                              ""
                            )
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
                        sx={{ width: "175px", mr: "15px" }}
                        onChange={(date) => setStartDate(onDateChange(date))}
                      />
                      <DesktopDatePicker
                        label="End Date"
                        sx={{ width: "175px" }}
                        onChange={(date) => setEndDate(onDateChange(date))}
                      />
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item>
                  <Button
                    className="btn-green"
                    variant="contained"
                    size="small"
                    type="submit"
                  >
                    Plan Now
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}
      </Container>
      <Box name="plan-share-choose" sx={{ backgroundColor: "#F2F2F2" }}>
        {isSmallScreen ? (
          <Container maxWidth="lg">
            <Grid
              container
              minHeight={300}
              direction="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              spacing={3}
              py={2}
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
        ) : (
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
        )}
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
              {isSmallScreen ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    my: 4,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontSize: "25px", fontWeight: "bold" }}
                  >
                    Destination
                  </Typography>
                </Box>
              ) : (
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
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {isSmallScreen ? (
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={3}
                >
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
              {isSmallScreen ? (
                <Typography variant="h5" sx={{ fontSize: "18px", mb: 2 }}>
                  And many more ...
                </Typography>
              ) : (
                <Typography variant="h5">And many more ...</Typography>
              )}
            </Box>
          </Grid>
        </Container>
      </Box>
      <Box name="footer" className="layout" sx={{ backgroundColor: "#F2F2F2" }}>
        {isSmallScreen ? (
          <Typography variant="subtitle2" sx={{ fontSize: "10px" }}>
            FOR PROJECT PURPOSE ONLY
          </Typography>
        ) : (
          <Typography variant="subtitle2">FOR PROJECT PURPOSE ONLY</Typography>
        )}
      </Box>
    </>
  );
}
