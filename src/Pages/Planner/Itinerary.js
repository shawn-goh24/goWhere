import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Place from "../../Components/Place";

import CollapseToggle from "../../Components/CollaspeToggle";
import {
  getDatesInRange,
  getItineraryItems,
  getPlaces,
  sortPlaces,
  createUpdateObj,
} from "../../utils";
import { onValue, ref, update } from "firebase/database";
import { database } from "../../firebase";

export default function Itinerary(props) {
  const { tripDetails, user, trip, item } = props;
  const [currentItem, setCurrentItem] = useState(null);
  const [itineraryItems, setItineraryItems] = useState(
    item && getItineraryItems(item)
  );

  useEffect(() => {
    const placeRef = ref(database, `trips/${trip}/places`);
    onValue(placeRef, (data) => {
      if (data.val()) {
        const newItem = getItineraryItems(data.val());
        const tmpItem = [];
        setItineraryItems([...tmpItem, ...newItem]);
      } else if (data.val() === null || data.val() === undefined) {
        setItineraryItems([]);
      }
    });
  }, []);

  const tripDates =
    tripDetails && getDatesInRange(tripDetails.startDate, tripDetails.endDate);

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

    const updatedPlace = { ...currentItem };
    updatedPlace.date = date;

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
  };

  return (
    <>
      <Box sx={{ p: "0 10px", height: "100%" }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: "bold", pl: 2 }}
        >
          Itinerary
        </Typography>
        {itineraryItems.length > 0 ? (
          tripDates &&
          tripDates.map((date, index) => {
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
                <Grid container gap={3}>
                  {itineraryItems &&
                    sortPlaces(getPlaces(itineraryItems, date)).map(
                      (item, index) => (
                        <Grid item xs={12} key={`${item.name}-${index}`}>
                          <Place
                            item={item}
                            user={user}
                            trip={trip}
                            handleAddItinerary={props.handleAddItinerary}
                            source="itinerary"
                            id={item.name}
                            index={index}
                            handleDragStart={handleDragStart}
                            handleDragEnter={handleDragEnter}
                            handleDragEnd={handleDragEnd}
                            handleDrop={handleDrop}
                            setSnackStatus={props.setSnackStatus}
                            snackStatus={props.snackStatus}
                            updatePlaceNum={props.updatePlaceNum}
                            isSmallScreen={props.isSmallScreen}
                          />
                        </Grid>
                      )
                    )}
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
