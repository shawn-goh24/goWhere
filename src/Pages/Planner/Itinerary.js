import React, { useState, useEffect } from "react";
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
} from "../../utils";

export default function Itinerary(props) {
  const { tripDetails, user, trip, item } = props;
  const [itinerary, setItinerary] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    setItinerary(createItinerary(tripDetails));
  }, [tripDetails]);

  const tripDates =
    tripDetails && getDatesInRange(tripDetails.startDate, tripDetails.endDate);

  const itineraryItems = item && getItineraryItems(item);

  const handleDragStart = (item) => {
    // const newItinerary = [...[...itinerary]];
    // const currentPlaceId = item.uid;
    // const currentPlaceDate = item.date;

    // newItinerary.forEach((day, index) => {
    //   const dayDate = Object.keys(day).toString();
    //   if (dayDate === currentPlaceDate) {
    //     const [hasDuplicate, duplicateIndex] = findDuplicate(
    //       newItinerary[index][dayDate],
    //       currentPlaceId
    //     );
    //     if (hasDuplicate) {
    //       newItinerary[index][dayDate].splice(duplicateIndex, 1);
    //     }
    //   }
    // });

    setCurrentItem(item);
    console.log(item);
  };

  const handleDrop = (date) => {
    console.log(date);
    const newItinerary = [...itinerary];
    const currentPlaceId = currentItem.uid;
    const currentPlaceDate = currentItem.date;
    console.log(`Current Place ID: ${currentPlaceId}`);
    console.log(`Current Place date: ${currentPlaceDate}`);

    // Add current selected item into the new day
    newItinerary.forEach((day, index) => {
      const dayDate = Object.keys(day).toString();
      console.log(`dayDate: ${dayDate}`);
      if (dayDate === date) {
        const hasDuplicate = findDuplicate(
          newItinerary[index][dayDate],
          currentPlaceId
        )[0];
        // If place does not exist in that day's itinerary,
        // Add it into the day
        // Else ignore
        if (!hasDuplicate) {
          newItinerary[index][dayDate].push(currentItem);
        }
      }
      // if (dayDate === currentPlaceDate) {
      //   const [hasDuplicate, duplicateIndex] = findDuplicate(
      //     newItinerary[index][dayDate],
      //     currentPlaceId
      //   );
      //   if (hasDuplicate) {
      //     newItinerary[index][dayDate].splice(duplicateIndex, 1);
      //   }
      // }
    });
    setItinerary(newItinerary);

    // Remove
  };

  console.log(itinerary);

  return (
    <>
      <Box sx={{ p: "0 10px", height: "100%" }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          Itinerary
        </Typography>
        {itineraryItems.length > 0 ? (
          itinerary &&
          itinerary.map((day, index) => {
            const date = Object.keys(day).toString();
            return (
              <CollapseToggle
                date={date}
                user={user}
                trip={trip}
                key={`${date}-${index}`}
                ref={(node) => props.updateDateRef(date, node)}
                handleDrop={handleDrop}
              >
                <Grid container>
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
