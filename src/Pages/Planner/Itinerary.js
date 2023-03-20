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

  const tripDates =
    tripDetails && getDatesInRange(tripDetails.startDate, tripDetails.endDate);

  const itineraryItems = item && getItineraryItems(item);

  return (
    <>
      <Box sx={{ p: "0 10px", height: "100%" }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          Itinerary
        </Typography>
        {itineraryItems.length > 0 ? (
          tripDates &&
          tripDates.map((date, index) => (
            <CollapseToggle
              date={date}
              user={user}
              trip={trip}
              key={`${date}-${index}`}
              ref={(node) => props.updateDateRef(date, node)}
            >
              <Grid container>
                {itineraryItems &&
                  itineraryItems.map((item, index) => {
                    if (item.date === date) {
                      return (
                        <Grid item xs={12} key={`${item.name}-${index}`}>
                          <Place
                            item={item}
                            user={user}
                            trip={trip}
                            handleAddItinerary=""
                            source="itinerary"
                          />
                        </Grid>
                      );
                    }
                  })}
              </Grid>
            </CollapseToggle>
          ))
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
