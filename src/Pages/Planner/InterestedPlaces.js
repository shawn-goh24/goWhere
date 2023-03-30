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
import {
  onValue,
  push,
  ref,
  runTransaction,
  set,
  get,
} from "firebase/database";
import Place from "../../Components/Place";
import AddToItinerary from "./AddToItinerary";
import SearchBox from "../../Components/SearchBox";
import { getPlaces, createArray, generateNextId } from "../../utils";

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

    if (interest.name && cost) {
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
        position: 0,
      };
      set(newPlaceRef, newPlace);
      resetInterest();
    } else {
      console.log("Empty");
    }

    setCost(0);
    setNote("");
  };

  // const handleAddItinerary = (item) => {
  //   setIsOpen(!isOpen);
  //   setSelected(item);

  //   const tmpDates = [];
  //   setDates(...tmpDates, [tripDetails.startDate, tripDetails.endDate]);
  //   // console.log(item);
  // };

  // const handleClose = () => {
  //   setIsOpen(!isOpen);
  // };

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

  // const items = item.map((item) => {
  //   return (
  //     <Grid item xs={12} key={item.uid}>
  //       <Place
  //         key={item.uid}
  //         item={item}
  //         trip={trip}
  //         user={user}
  //         handleAddItinerary={handleAddItinerary}
  //         source="InterestedPlace"
  //         setSnackStatus={props.setSnackStatus}
  //         snackStatus={props.snackStatus}
  //         updatePlaceNum={props.updatePlaceNum}
  //       />
  //     </Grid>
  //   );
  // });

  // const addToDate = (placeId, selectedDate) => {
  //   console.log("addToDate");
  //   const addToDateRef = ref(database, `trips/${trip}/places/${placeId}`);
  //   const placesRef = ref(database, `trips/${trip}/places`);
  //   const date = { date: selectedDate };

  //   get(placesRef)
  //     .then((snapshot) => {
  //       let positionId = 0;
  //       if (snapshot.exists()) {
  //         const data = createArray(snapshot.val());
  //         const existingPlaces = getPlaces(data, selectedDate);
  //         if (existingPlaces.length > 0) {
  //           positionId = generateNextId(existingPlaces);
  //         }
  //       } else {
  //         console.log("Get no Data");
  //       }
  //       return positionId;
  //     })
  //     .then((positionNum) => {
  //       runTransaction(addToDateRef, (place) => {
  //         place.position = positionNum;
  //         if (place) {
  //           if (place.date) {
  //             place.date = selectedDate;
  //           } else if (!place.date) {
  //             place.date = selectedDate;
  //           }
  //         }
  //         return place;
  //       });
  //     });
  // };

  // console.log("Interested Places START");
  // console.log(item);
  // console.log("Interested Places END");

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
      <Box
        // component="form"
        // onSubmit={(e) => handleAddPlace()}
        name="inputs"
        sx={{ backgroundColor: "#f2f2f2" }}
      >
        <Grid container padding="10px" gap={3}>
          <Grid item lg={8} xs={12}>
            <SearchBox handleInterest={handleInterest} />
            {/* <TextField
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
            /> */}
          </Grid>
          <Grid item lg={3} xs={12}>
            <TextField
              value={cost}
              required
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
          {/* {items} */}
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
      {/* <AddToItinerary
        isOpen={isOpen}
        handleClose={handleClose}
        item={selected}
        dates={dates}
        trip={trip}
        user={user}
        addToDate={addToDate}
      /> */}
    </Box>
  );
}
