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
  TextField,
  Snackbar,
} from "@mui/material";

export default function Place(props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isdraggble, setIsDraggable] = useState("false");
  const [isdroppable, setIsDroppable] = useState("false");
  const [isHovering, setIsHovering] = useState(false);
  const [note, setNote] = useState(props.item.note);
  const [cost, setCost] = useState(props.item.cost);
  const [showAlert, setShowAlert] = useState(false);
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

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };

  const handleCostChange = (input) => {
    let newInput = input.slice(4);
    const lastChar = newInput.length - 1;
    if (newInput[lastChar] !== "." && newInput !== "") {
      newInput = parseFloat(newInput);
      if (typeof newInput !== "number" || isNaN(newInput)) {
        setShowAlert(true);
        setCost(0);
      } else {
        setCost(newInput);
      }
    } else {
      setCost(newInput);
    }
  };

  const handleNoteFocusOut = (placeId) => {
    const placeRef = ref(database, `trips/${trip}/places/${placeId}`);
    runTransaction(placeRef, (place) => {
      if (place) {
        place.note = note;
      }
      return place;
    });
  };

  const handleCostFocusOut = (placeId) => {
    if (cost.length === 0) {
      setCost(0);
    }
    const newCost = parseFloat(cost);
    if (typeof newCost !== "number" || isNaN(newCost)) {
      setShowAlert(true);
    } else {
      const placeRef = ref(database, `trips/${trip}/places/${placeId}`);
      runTransaction(placeRef, (place) => {
        if (place) {
          place.cost = newCost;
        }
        return place;
      }).catch((e) => {
        console.log(e);
      });
    }
  };

  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleDragMouseDown = () => {
    setIsDraggable("true");
    setIsDroppable("true");
  };

  const handleDragMouseUp = () => {
    setIsDraggable("false");
    setIsDroppable("false");
  };

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
    setIsDraggable("false");
    setIsDroppable("false");
  };

  const removePlace = (placeId) => {
    const placeRef = ref(database, `trips/${trip}/places/${placeId}`);
    runTransaction(placeRef, (place) => {
      if (place) {
        place.date = "";
      }
      return place;
    })
      .then(() => {
        props.updatePlaceNum(item.date);
      })
      .then(() => {
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
    remove(placeRef)
      .then(() => {
        props.updatePlaceNum(item.date);
      })
      .then(() => {
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
        sx={
          source === "itinerary"
            ? { padding: "0 10px", marginBottom: "10px" }
            : { padding: "0" }
        }
        draggable={
          source === "itinerary" ? isdraggble.toString() : "false".toString()
        }
        droppable={
          source === "itinerary" ? isdroppable.toString() : "false".toString()
        }
        onDragStart={handleDragStart}
        onDragEnter={() => props.handleDragEnter(item.position)}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragEnd}
        className={source === "itinerary" && "place"}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#D3EEDC40",
            display: "flex",
            p: "15px 15px 5px 10px",
          }}
        >
          <Grid container>
            <Grid item xs={1} sx={{ mt: "3px" }}>
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
            </Grid>
            <Grid item xs={11}>
              <Grid container>
                <Grid item xs={12} sm={8}>
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      lineHeight: "1.5rem",
                    }}
                  >
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
                          <i> Not added to itinerary</i>
                        </Typography>
                      )
                    ) : null}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Grid
                    container
                    justifyContent={{ sm: "flex-end", xs: "flex-start" }}
                    width="100%"
                    gap={0}
                  >
                    <Grid
                      item
                      style={{ margin: "5px 0" }}
                      sm={source === "InterestedPlace" ? 6 : 7}
                      xs={source === "InterestedPlace" ? 3 : 3}
                    >
                      <TextField
                        fullWidth
                        variant="standard"
                        value={"SGD " + cost}
                        defaultValue={0}
                        onChange={(e) => handleCostChange(e.target.value)}
                        onBlur={() => handleCostFocusOut(item.uid)}
                        InputProps={{
                          disableUnderline: true,
                          inputProps: {
                            style: {
                              color: "#733D29",
                              margin: 0,
                              padding: 0,
                              fontWeight: "700",
                              display: "inline-block",
                            },
                          },
                        }}
                        InputLabelProps={{ style: { color: "#733D29" } }}
                        sx={{ textAlign: { sm: "right", xs: "left" } }}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        margin: "-2px 0 0 0px",
                        padding: "0 5px 0 0",
                      }}
                      sx={{ textAlign: { sm: "right", xs: "left" } }}
                      sm={source === "InterestedPlace" ? 4 : 5}
                      xs={source === "InterestedPlace" ? 3 : 5}
                    >
                      <IconButton onClick={() => handleLikes(item.uid)}>
                        <FavoriteIcon
                          color={likeColor}
                          sx={{ width: "22px", height: "22px" }}
                        />
                      </IconButton>
                      <Typography
                        style={{
                          textAlign: { sm: "right", xs: "left" },
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
                        style={{ margin: "-3px 0 0 0px", textAlign: "right" }}
                        sm={2}
                        xs={6}
                      >
                        <IconButton onClick={() => handleAddItinerary(item)}>
                          <AddIcon sx={{ width: "22px", height: "22px" }} />
                        </IconButton>
                      </Grid>
                    )}
                    {/* <Grid item xs={5} sm={5}>
                      <Grid container justifyContent="flex-end"> */}
                    <Grid
                      item
                      sm={3}
                      xs={3}
                      sx={{
                        textAlign: { sm: "right", xs: "right" },
                        mr: {
                          sm: source === "itinerary" ? "0" : "-6px",
                          xs: "0",
                        },
                        mt: { sm: "2px", xs: "0", md: "0" },
                      }}
                    >
                      <IconButton
                        onClick={() => setIsOpen(true)}
                        sx={{
                          opacity: isHovering ? "1" : "0",
                          transition: "opacity 0.7s",
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>

                    {source === "itinerary" && (
                      <Grid
                        item
                        sm={2}
                        xs={1}
                        sx={{
                          textAlign: "right",
                          mr: { md: "6px", sm: "-5px", xs: "0" },
                          mt: { xs: "-2px" },
                        }}
                      >
                        <IconButton>
                          <DragIndicatorIcon
                            // fontSize="small"
                            onMouseDown={handleDragMouseDown}
                            onMouseUp={handleDragMouseUp}
                            // sx={{ fontSize: 23 }}
                          />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              {/* </Grid>
              </Grid> */}

              <Grid
                container
                sx={{
                  mt: {
                    sm: source === "itinerary" ? "-18px" : "-5px",
                    xs: source === "itinerary" ? "-8px" : "-5px",
                  },
                }}
              >
                <TextField
                  id="outlined-textarea"
                  label={
                    <span style={{ fontSize: "0.9rem" }}>
                      {note.length > 0 ? "Notes:" : "Add notes"}
                    </span>
                  }
                  size="small"
                  multiline
                  fullWidth
                  variant="standard"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={() => handleNoteFocusOut(item.uid)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { color: "#733D29" } }}
                />
              </Grid>
            </Grid>
          </Grid>
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showAlert}
        autoHideDuration={1500}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          sx={{ width: "100%" }}
          variant="filled"
          severity="error"
        >
          "Please enter only number"
        </Alert>
      </Snackbar>
    </>
  );
}
