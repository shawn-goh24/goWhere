import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

import { convertTripDate } from "../utils";
import { useNavigate } from "react-router-dom";

export default function TripsBox(props) {
  let dateString = convertTripDate(props.trip.startDate, props.trip.endDate);

  const navigate = useNavigate();

  const handleClick = () => {
    const tripGeolocation = {
      lat: props.trip.locationLat,
      lng: props.trip.locationLng,
    };
    // console.log(tripGeolocation);
    // console.log(props.trip.mapViewBound);
    props.setTripGeolocation(tripGeolocation);
    props.setMapViewBound(props.trip.mapViewBound);
    navigate(`/planner/${props.trip.tripId}`);
  };

  return (
    <>
      <Card sx={{ maxWidth: 345, borderRadius: "15px" }}>
        <CardActionArea onClick={handleClick}>
          <CardMedia
            component="img"
            height="140"
            image="https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80"
            alt="tokyo"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ lineHeight: "1.2rem", fontSize: "1.1rem" }}
            >
              {props.trip.country}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dateString}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
