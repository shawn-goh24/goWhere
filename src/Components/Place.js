import { Box, IconButton, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import { onValue, push, ref, runTransaction, remove } from "firebase/database";
import { database } from "../firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";

export default function Place(props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const [snackStatus, setSnackStatus] = useState({
  //   open: false,
  //   msg: "",
  // });
  const { item, user, trip, handleAddItinerary, source } = props;

  let likeColor = "";
  if (item.likes == undefined || user === null) {
    likeColor = "default";
  } else if (item.likes[user.uid] !== true) {
    likeColor = "default";
  } else {
    likeColor = "error";
  }

  const handleLikes = (placeId) => {
    const placeRef = ref(database, `trips/${trip}/places/${placeId}`);
    runTransaction(placeRef, (place) => {
      if (place) {
        if (place.likes && place.likes[user.uid]) {
          place.likeCount--;
          place.likes[user.uid] = null;
        } else {
          place.likeCount++;
          if (!place.likes) {
            place.likes = {};
          }
          place.likes[user.uid] = true;
        }
      }
      return place;
    });
  };

  // const handlePlaceClick = () => {
  //   console.log("Place clicked");
  // };

  // console.log("Place Item START");
  // console.log(item);
  // console.log("Place Item END");

  const handleDragStart = () => {
    setIsDragging(true);
    props.handleDragStart(item, item.position);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnd = () => {
    setIsDragOver(false);
    //setIsDragging(false);
  };

  const handleDrop = () => {
    props.handleDrop(item.position, item.date, "place");
    setIsDragOver(false);
    setIsDragging(false);
  };

  const removePlace = (placeId) => {
    const placeRef = ref(database, `trips/${trip}/places/${placeId}`);
    runTransaction(placeRef, (place) => {
      if (place) {
        place.date = "";
      }
      return place;
    }).then(() => {
      props.setSnackStatus({
        ...props.snackStatus,
        open: true,
        msg: "Place removed",
      });
      console.log("Successful remove from itinerary");
    });
  };

  const deletePlace = (placeId) => {
    const placeRef = ref(database, `trips/${trip}/places/${placeId}`);
    remove(placeRef).then(() => {
      props.setSnackStatus({
        ...props.snackStatus,
        open: true,
        msg: "Place deleted",
      });
      console.log("Successful deleted from trips");
    });
  };

  return (
    <>
      <Box
        sx={source === "itinerary" ? { padding: "0 10px" } : { padding: "0" }}
        draggable={"true".toString()}
        droppable={"true".toString()}
        onDragStart={handleDragStart}
        onDragEnter={() => props.handleDragEnter(item.position)}
        // onDragEnd={() => props.handleDragEnd(item.position, item.date)}
        onDrop={handleDrop}
        // onDrop={() => props.handleDrop(item.position, item.date)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragEnd}
        // onDragOver={() => props.handleDrop(item.position, item.date)}
        className={source === "itinerary" && "place"}
      >
        <Paper
          elevation={0}
          // variant="outlined"
          sx={{
            backgroundColor: "#D3EEDC40",
            display: "flex",
            p: "15px 10px",
          }}
        >
          <Box py={0.5} mr={1}>
            <span className="fa-stack">
              <span
                className="fa fa-location-pin fa-stack-2x"
                style={{
                  color: "#733D29",
                  fontSize: source === "itinerary" ? "2em" : "1.5em",
                }}
              ></span>
              {source === "InterestedPlace" ? null : (
                <strong
                  className="fa-stack-1x"
                  style={{
                    color: "white",
                    lineHeight: "1.5rem",
                    fontSize: "0.8rem",
                  }}
                >
                  {item.position + 1}
                </strong>
              )}
            </span>
          </Box>
          <Grid container>
            <Grid item xs={8}>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {item.name}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "#575958", fontWeight: 400 }}
              >
                Added by {item.addedBy}
              </Typography>
              <Typography variant="subtitle2">
                {source !== "itinerary" ? (
                  item.date ? (
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#575958", fontWeight: 400 }}
                    >
                      Date: {item.date}
                    </Typography>
                  ) : (
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#575958", fontWeight: 400 }}
                    >
                      Not added to itinerary
                    </Typography>
                  )
                ) : null}
                {/* {item.date ? `Date: ${item.date}` : "Date: -"} */}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Grid container justifyContent="flex-end" width="100%" gap={0}>
                <Grid
                  item
                  style={{ margin: "5px 0" }}
                  xs={source === "InterestedPlace" ? 5 : 7}
                >
                  <Typography
                    sx={{
                      color: "#733D29",
                      m: 0,
                      p: 0,
                      fontWeight: "700",
                      textAlign: "right",
                    }}
                  >
                    SGD {item.cost}
                  </Typography>
                </Grid>
                <Grid
                  item
                  style={{ margin: "-2px 0 0 0px", textAlign: "right" }}
                  xs={source === "InterestedPlace" ? 4 : 5}
                >
                  <IconButton onClick={() => handleLikes(item.uid)}>
                    <FavoriteIcon
                      color={likeColor}
                      sx={{ width: "22px", height: "22px" }}
                    />
                  </IconButton>
                  <Typography
                    style={{
                      textAlign: "right",
                      fontSize: "1rem",
                      m: 0,
                      p: 0,
                      display: "inline-block",
                    }}
                  >
                    {item.likeCount ? item.likeCount : "0"}
                  </Typography>
                </Grid>
                {source === "InterestedPlace" && (
                  <Grid
                    item
                    style={{ margin: "-2px 0 0 0px", textAlign: "right" }}
                    xs={3}
                  >
                    <IconButton onClick={() => handleAddItinerary(item)}>
                      <AddIcon sx={{ width: "22px", height: "22px" }} />
                    </IconButton>
                  </Grid>
                )}
                {source === "itinerary" && (
                  <Grid
                    item
                    xs={12}
                    sx={{ textAlign: "right", mb: 1 }}
                    style={{ margin: "auto" }}
                  >
                    <IconButton>
                      <DragIndicatorIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  sx={{ textAlign: "right" }}
                  style={{ margin: "auto" }}
                >
                  <IconButton onClick={() => setIsOpen(true)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={1}>
            <Typography variant="body1">{item.note}</Typography>
          </Box>
        </Paper>
        {source === "itinerary" && (
          <div
            style={{
              height: isDragOver ? "100px" : 0,
              transition: "all 0.3s",
            }}
          ></div>
        )}
      </Box>
      <Dialog
        open={isOpen}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              padding: "5px",
            },
          },
        }}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            {source === "itinerary"
              ? "Are you sure you want to remove/delete this place?"
              : "Are you sure you want to delete this place?"}
          </Alert>
        </DialogContent>
        <DialogActions>
          {source === "itinerary" && (
            <Button
              onClick={() => removePlace(item.uid)}
              className="btn-orange"
              autoFocus
            >
              Remove from Itinerary
            </Button>
          )}

          <Button
            onClick={() => deletePlace(item.uid)}
            className="btn-red"
            autoFocus
          >
            Delete from Trip
          </Button>
          <Button onClick={() => setIsOpen(false)} sx={{ color: "black" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
