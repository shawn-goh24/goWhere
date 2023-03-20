import { Box, IconButton, Paper, Typography } from "@mui/material";
import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import { onValue, push, ref, runTransaction, set } from "firebase/database";
import { database } from "../firebase";

export default function Place(props) {
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

  return (
    // <Box onClick={handlePlaceClick} sx={{ cursor: "pointer" }}>
    <Box sx={{ mb: 2 }}>
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
            <strong className="fa-stack-1x" style={{ color: "white" }}>
              1
            </strong>
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
                {item.date ? `Date: ${item.date}` : "Date: -"}
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
    </Box>
  );
}
