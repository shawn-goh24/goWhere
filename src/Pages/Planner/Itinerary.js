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
    setCurrentItem(item);
    console.log(item);
  };

  const handleDrop = (date) => {
    // const newItinerary = [...itinerary]

    // newItinerary.forEach(day => {
    //   const dayDate = Object.keys(day);
    //   if(dayDate === date){

    //   }
    // })

    console.log(date);
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
            const date = Object.keys(day);
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
