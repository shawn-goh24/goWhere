import React, { useEffect, useState } from "react";
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
import { onValue, push, ref, runTransaction, set } from "firebase/database";
import Place from "../../Components/Place";

const DB_PLACES_KEY = "places";

export default function InterestedPlaces(props) {
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState(0);
  const [note, setNote] = useState("");
  const [item, setItem] = useState([]);

  const { interest, data, trip, user } = props;

  useEffect(() => {
    console.log("inside interested places useeffect");
    const placeRef = ref(database, `trips/${trip}/places`);
    onValue(placeRef, (data) => {
      if (data.val()) {
        const tmpItem = [];
        setItem([...tmpItem, ...Object.values(data.val())]);
      }
    });
  }, []);

  const handleAddPlace = () => {
    const placeRef = ref(database, `trips/${trip}/${DB_PLACES_KEY}`);
    const newPlaceRef = push(placeRef);

    const newPlace = {
      uid: newPlaceRef.key,
      name: interest.name,
      address: interest.address,
      lat: interest.lat,
      lng: interest.lng,
      cost: cost,
      note: note,
      addedBy: user.displayName,
      likeCount: 0,
      // date, likecount, likeby
    };
    console.log(newPlace);
    set(newPlaceRef, newPlace);
    alert("sent to database");
  };

  const handleLikes = (placeId) => {
    const placeRef = ref(database, `trips/${trip}/places/${placeId}`);
    runTransaction(placeRef, (place) => {
      if (place) {
        if (place.likes && place.likes[user.uid]) {
          place.likeCount--;
          place.likes[user.uid] = null;
        } else {
          place.likeCount++;
          if (!place.likes) {
            place.likes = {};
          }
          place.likes[user.uid] = true;
        }
      }
      return place;
    });
  };

  const items = item.map((item) => {
    // console.log(user);
    return (
      <Place key={item.uid} item={item} handleLikes={handleLikes} user={user} />
    );
  });

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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
            />
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
            {/* <Button fullWidth variant="outlined">
              Extra button
            </Button> */}
          </Grid>
        </Grid>
      </Box>
      <Box name="contents">
        {items}
        {/* <Place />
        <Place />
        <Place />
        <Place />
        <Place /> */}
      </Box>
    </Box>
  );
}
