import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  FormControl,
  Grid,
  OutlinedInput,
  TextField,
  Typography,
  Button,
  List,
  ListItemText,
  ListItemButton,
  Collapse,
} from "@mui/material";
import Place from "../../Components/Place";
import CollapseToggle from "../../Components/CollaspeToggle";
import {
  getDatesInRange,
  getItineraryItems,
  createItinerary,
  findDuplicate,
  getPlaces,
  sortPlaces,
  createUpdateObj,
} from "../../utils";
import { onValue, push, ref, runTransaction, update } from "firebase/database";
import { database } from "../../firebase";

export default function Itinerary(props) {
  const { tripDetails, user, trip, item } = props;
  // const [itinerary, setItinerary] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  //const [itineraryItems, setItineraryItems] = useState(getItineraryItems(item));

  // useEffect(() => {
  //   setItinerary(createItinerary(tripDetails));
  // }, [tripDetails]);

  // useEffect(() => {
  //   const temp = item && getItineraryItems(item);
  //   setItineraryItems(temp);
  // }, [item]);

  const tripDates =
    tripDetails && getDatesInRange(tripDetails.startDate, tripDetails.endDate);

  const itineraryItems = item && getItineraryItems(item);

  // console.log("Itinerary Items START");
  // console.log(itineraryItems);
  // console.log("Itinerary Items END");

  let itemDragged = useRef();
  let itemDraggedDate = useRef();
  let itemDragOver = useRef();

  const handleDragEnter = (position) => {
    console.log(`DragEnter: ${position}`);
    itemDragOver.current = position;
  };
  const handleDragEnd = (position, date) => {
    console.log(`DragEnd: ${position}`);
    const placeRef = ref(database, `trips/${trip}/places/${currentItem.uid}`);

    const newPlace = { ...currentItem };

    newPlace.date = date;

    update(placeRef, newPlace);
  };

  const handleDragStart = (item, position) => {
    itemDragged.current = position;
    itemDraggedDate.current = item.date;
    setCurrentItem(item);
  };

  const handleDrop = (position, date, source) => {
    console.log("dropped");
    const placesInDay = sortPlaces(getPlaces(itineraryItems, date));
    const placesInPrevDay = sortPlaces(
      getPlaces(itineraryItems, itemDraggedDate.current)
    );
    const placesRef = ref(database, `trips/${trip}/places`);

    // console.log(`Date: ${date}`);
    // console.log(`itemDragOverDate: ${itemDragOverDate.current}`);

    const updatedPlace = { ...currentItem };
    updatedPlace.date = date;
    // if (source === "toggle") {
    //   updatedPlace.position = position;
    // }

    // console.log(updatedPlace);
    // console.log(date);
    // console.log(itemDraggedDate.current);

    if (date === itemDraggedDate.current) {
      console.log("replace");
      console.log(itemDragOver.current);
      console.log(currentItem.position);
      placesInDay.splice(currentItem.position, 1);
      if (source === "toggle" || itemDragOver.current > currentItem.position) {
        // If it is dragged into Toggle box, use the position provided by Toggle box
        // Position provided by Toggle box is 0, to position the place at the start of the array
        placesInDay.splice(itemDragOver.current, 0, currentItem);
      } else {
        placesInDay.splice(itemDragOver.current + 1, 0, currentItem);
      }
      const updates = createUpdateObj(placesInDay);
      update(placesRef, updates);
    } else {
      console.log("Add new");
      console.log(itemDragOver.current);
      if (source === "toggle" || itemDragOver.current > currentItem.position) {
        // If it is dragged into Toggle box, use the position provided by Toggle box
        // Position provided by Toggle box is 0, to position the place at the start of the array
        placesInDay.splice(itemDragOver.current, 0, updatedPlace);
      } else {
        placesInDay.splice(itemDragOver.current + 1, 0, updatedPlace);
      }
      // Remove the dragged item from it's previous date
      placesInPrevDay.splice(itemDragged.current, 1);
      const placesInDayObj = createUpdateObj(placesInDay);
      const placesInPrevDayObj = createUpdateObj(placesInPrevDay);
      const mergedUpdates = { ...placesInDayObj, ...placesInPrevDayObj };
      update(placesRef, mergedUpdates);
    }

    // console.log(placesInDay);

    // const updates = createUpdateObj(placesInDay);
    // update(placesRef, updates);
  };

  //console.log(itinerary);

  return (
    <>
      <Box sx={{ p: "0 10px", height: "100%" }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          Itinerary
        </Typography>
        {itineraryItems.length > 0 ? (
          tripDates &&
          tripDates.map((date, index) => {
            //const date = Object.keys(day).toString();
            return (
              <CollapseToggle
                date={date}
                user={user}
                trip={trip}
                key={`${date}-${index}`}
                ref={(node) => props.updateDateRef(date, node)}
                handleDrop={handleDrop}
                handleDragEnter={handleDragEnter}
              >
                {/* <Grid container>
                  {day[date].map((item, index) => {
                    // if (item.date === date) {
                    return (
                      <Grid item xs={12} key={`${item.name}-${index}`}>
                        <Place
                          item={item}
                          user={user}
                          trip={trip}
                          handleAddItinerary=""
                          source="itinerary"
                          handleDragStart={handleDragStart}
                        />
                      </Grid>
                    );
                    //}
                  })}
                </Grid> */}
                <Grid container>
                  {
                    itineraryItems &&
                      sortPlaces(getPlaces(itineraryItems, date)).map(
                        (item, index) => (
                          <Grid item xs={12} key={`${item.name}-${index}`}>
                            <Place
                              item={item}
                              user={user}
                              trip={trip}
                              handleAddItinerary=""
                              source="itinerary"
                              id={item.name}
                              index={index}
                              handleDragStart={handleDragStart}
                              handleDragEnter={handleDragEnter}
                              handleDragEnd={handleDragEnd}
                              handleDrop={handleDrop}
                            />
                          </Grid>
                        )
                      )
                    // itineraryItems.map((item, index) => {
                    //   const placeArr = [];
                    //   if (item.date === date) {
                    //     placeArr.push(item);
                    //     return (
                    //       <Grid item xs={12} key={`${item.name}-${index}`}>
                    //         <Place
                    //           item={item}
                    //           user={user}
                    //           trip={trip}
                    //           handleAddItinerary=""
                    //           source="itinerary"
                    //           id={item.name}
                    //           index={index}
                    //           handleDragStart={handleDragStart}
                    //         />
                    //       </Grid>
                    //     );
                    //   }
                    // })
                  }
                </Grid>
              </CollapseToggle>
            );
          })
        ) : (
          <Typography sx={{ mt: 3 }}>
            No activities in itinerary, click{" "}
            <span
              onClick={() => props.setSelection("Interested Places")}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              here
            </span>{" "}
            to add a place.
          </Typography>
        )}
      </Box>
    </>
  );
}
