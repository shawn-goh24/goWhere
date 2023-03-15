import React, { useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  OutlinedInput,
  TextField,
  Typography,
  InputAdornment,
  InputLabel,
  Button,
} from "@mui/material";
import hero from "../../Assets/hero-1920x1280.jpg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { database } from "../../firebase";
import { push, ref, set } from "firebase/database";
import Place from "../../Components/Place";

const DB_PLACES_KEY = "places";

export default function InterestedPlaces(props) {
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState(0);
  const [note, setNote] = useState("");

  const { interest } = props;

  const handleChange = (event) => {
    setLocation(event.target.value);
  };

  const handleAddPlace = () => {
    const placeRef = ref(database, DB_PLACES_KEY);
    const newPlaceRef = push(placeRef);

    const newPlace = {
      uid: newPlaceRef.key,
      name: interest.name,
      address: interest.address,
      lat: interest.lat,
      lng: interest.lng,
      cost: cost,
      note: note,
      // add addedby, date, likecount, likeby
    };
    set(newPlaceRef, newPlace);
    alert("sent to database");
  };

  // console.log("Inside Interested Places");
  // console.log(interest);

  return (
    <Box>
      <Box name="title">
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          Interested Places
        </Typography>
      </Box>
      <Box name="inputs" sx={{ backgroundColor: "#f2f2f2" }}>
        <Grid container padding="10px" gap={3}>
          <Grid item lg={8}>
            <TextField
              required
              id="autocomplete"
              size="small"
              fullWidth
              label="Location"
              // onChange={(e) => handleChange(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
            />
            {/* <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-location">
                Location
              </InputLabel>
              <OutlinedInput
                size="small"
                id="outlined-adornment-location"
                startAdornment={
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                }
                label="location"
              />
            </FormControl> */}
          </Grid>
          <Grid item lg={3}>
            <TextField
              required
              size="small"
              label="Cost"
              type="number"
              onChange={(e) => setCost(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            {/* <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-cost">Cost</InputLabel>
              <OutlinedInput
                size="small"
                id="outlined-adornment-cost"
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="cost"
              />
            </FormControl> */}
          </Grid>
          <Grid item lg={8}>
            <TextField
              size="large"
              fullWidth
              label="Notes"
              multiline
              rows={2}
              onChange={(e) => setNote(e.target.value)}
            />
          </Grid>
          <Grid item lg={3}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: "5px" }}
              onClick={handleAddPlace}
            >
              Add
            </Button>
            <Button fullWidth variant="outlined">
              Extra button
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box name="contents">
        <Place />
        <Place />
        <Place />
        <Place />
        <Place />
        <Place />
      </Box>
    </Box>
  );
}
