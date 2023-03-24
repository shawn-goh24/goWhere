import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";

import { convertTripDate } from "../utils";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import userEvent from "@testing-library/user-event";
import { ref, remove } from "firebase/database";
import { database } from "../firebase";

export default function TripsBox(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

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

  const deleteTrip = () => {
    const tripRef = ref(database, `trips/${props.trip.tripId}`);
    remove(tripRef).then(() => handleSnackClick());
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const handleSnackClick = () => {
    setSnackOpen(true);
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
        </CardActionArea>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Box>
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
            </Box>
            {props.user.uid === props.trip.creatorId ? (
              <Box>
                <IconButton onClick={() => setIsOpen(true)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              ""
            )}
          </Box>
        </CardContent>
      </Card>
      <Dialog open={isOpen}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Are you sure you want to delete this trip?
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)} sx={{ color: "black" }}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteTrip()}
            className="btn-red"
            // sx={{ backgroundColor: "#8e1600", color: "white" }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} sx={{ width: "100%" }}>
          Trips deleted
        </Alert>
      </Snackbar>
    </>
  );
}
