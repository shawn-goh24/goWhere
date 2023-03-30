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
import { database } from "../../firebase";
import {
  onValue,
  push,
  ref,
  runTransaction,
  set,
  get,
} from "firebase/database";
import Place from "../../Components/Place";
import SearchBox from "../../Components/SearchBox";

const DB_PLACES_KEY = "places";

export default function InterestedPlaces(props) {
  const [location, setLocation] = useState("");
  const [cost, setCost] = useState(0);
  const [note, setNote] = useState("");
  const [item, setItem] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dates, setDates] = useState([]);
  const [interest, setInterest] = useState({});

  // const { tripDetails, trip, user, item } = props;
  const { tripDetails, trip, user } = props;

  useEffect(() => {
    const placeRef = ref(database, `trips/${trip}/places`);
    onValue(placeRef, (data) => {
      if (data.val()) {
        const tmpItem = [];
        setItem([...tmpItem, ...Object.values(data.val())]);
      } else if (data.val() === null || data.val() === undefined) {
        setItem([]);
      }
    });
  }, []);

  const handleAddPlace = () => {
    // e.preventDefault(); // Will show map reload if use onSubmit

    if (interest.name) {
      const placeRef = ref(database, `trips/${trip}/${DB_PLACES_KEY}`);
      const newPlaceRef = push(placeRef);

      const newPlace = {
        uid: newPlaceRef.key,
        name: interest.name,
        address: interest.address,
        lat: interest.lat,
        lng: interest.lng,
        cost: cost === null || cost === undefined ? 0 : cost,
        note: note,
        addedBy: user.displayName,
        likeCount: 0,
        position: 0,
      };
      set(newPlaceRef, newPlace);
      resetInterest();
      setCost(0);
    } else {
      console.log("Empty");
    }

    setCost(0);
    setNote("");
  };

  const handleInterest = (name, add, lat, lng) => {
    const tmp = {
      name: name,
      address: add,
      lat: lat,
      lng: lng,
    };
    setInterest(tmp);
  };

  const resetInterest = () => {
    setInterest({});
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box name="title">
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: "bold", pl: 2, pb: 2 }}
        >
          Interested Places
        </Typography>
      </Box>
      <Box name="inputs" sx={{ backgroundColor: "#f2f2f2" }}>
        <Grid container padding="10px" gap={3}>
          <Grid item lg={8} xs={12}>
            <SearchBox handleInterest={handleInterest} />
          </Grid>
          <Grid item lg={3} xs={12}>
            <TextField
              value={cost}
              fullWidth
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
          <Grid item lg={8} xs={12}>
            <TextField
              value={note}
              size="large"
              fullWidth
              label="Notes"
              multiline
              rows={2}
              onChange={(e) => setNote(e.target.value)}
            />
          </Grid>
          <Grid item lg={3} xs={12}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: "5px" }}
              onClick={handleAddPlace}
              type="submit"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box name="contents">
        <Grid container gap={3}>
          {item &&
            item.map((item) => (
              <Grid item xs={12} key={item.uid}>
                <Place
                  key={item.uid}
                  item={item}
                  trip={trip}
                  user={user}
                  handleAddItinerary={props.handleAddItinerary}
                  source="InterestedPlace"
                  setSnackStatus={props.setSnackStatus}
                  snackStatus={props.snackStatus}
                  updatePlaceNum={props.updatePlaceNum}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
}
