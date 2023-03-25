import { Box, IconButton, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import { onValue, push, ref, runTransaction, set } from "firebase/database";
import { database } from "../firebase";

export default function Place(props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { item, user, trip, handleAddItinerary, source } = props;
  // const { item, handleLikes, user, handleAddItinerary } = props;

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

  return (
    // <Box onClick={handlePlaceClick} sx={{ cursor: "pointer" }}>
    <Box
      sx={{ mb: 2 }}
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
          p: "5px",
        }}
      >
        <Box py={0.5} mr={1}>
          <span className="fa-stack">
            <span
              className="fa fa-location-pin fa-stack-2x"
              style={{ color: "#733D29" }}
            ></span>
            {source === "InterestedPlace" ? null : (
              <strong className="fa-stack-1x" style={{ color: "white" }}>
                {item.position + 1}
              </strong>
            )}
          </span>
        </Box>
        <Box width="100%">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="subtitle2">
                Added by {item.addedBy}
              </Typography>
              <Typography variant="subtitle2">
                {source !== "itinerary"
                  ? item.date
                    ? `Date: ${item.date}`
                    : "Date: -"
                  : null}
                {/* {item.date ? `Date: ${item.date}` : "Date: -"} */}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ color: "#733D29" }}>
                  SGD {item.cost}
                </Typography>
                <IconButton onClick={() => handleLikes(item.uid)}>
                  <FavoriteIcon
                    color={likeColor}
                    sx={{ width: "22px", height: "22px" }}
                  />
                </IconButton>
                {item.likeCount ? item.likeCount : "0"}
                {source === "InterestedPlace" && (
                  <IconButton onClick={() => handleAddItinerary(item)}>
                    <AddIcon sx={{ width: "22px", height: "22px" }} />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
          <Box mt={1}>
            <Typography variant="body1">{item.note}</Typography>
          </Box>
        </Box>
      </Paper>
      {source === "itinerary" && (
        <div
          style={{
            height: isDragOver ? "70px" : 0,
            transition: "all 0.3s",
          }}
        ></div>
      )}
    </Box>
  );
}
