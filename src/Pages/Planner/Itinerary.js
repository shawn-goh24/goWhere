import React, { useRef, forwardRef } from "react";
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
import { getDatesInRange, getItineraryItems } from "../../utils";

export default function Itinerary(props) {
  const { tripDetails, user, trip, item } = props;
  // const datesRef = useRef([]);

  const tripDates =
    tripDetails && getDatesInRange(tripDetails.startDate, tripDetails.endDate);

  const itineraryItems = item && getItineraryItems(item);

  // const getMap = () => {
  //   if (!datesRef.current) {
  //     // Initialize the Map on first usage.
  //     datesRef.current = new Map();
  //   }
  //   return datesRef.current;
  // };

  return (
    <>
      <Box sx={{ p: "0 10px", height: "100%" }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          Itinerary
        </Typography>
        {tripDates &&
          tripDates.map((date, index) => (
            <CollapseToggle
              date={date}
              user={user}
              trip={trip}
              key={`${date}-${index}`}
              ref={(node) => props.updateDateRef(date, node)}
            >
              {itineraryItems &&
                itineraryItems.map((item, index) => {
                  if (item.date === date) {
                    return (
                      <Place
                        item={item}
                        user={user}
                        trip={trip}
                        handleAddItinerary=""
                        key={`${item.name}-${index}`}
                      />
                    );
                  }
                })}
            </CollapseToggle>
          ))}
      </Box>
    </>
  );
}
