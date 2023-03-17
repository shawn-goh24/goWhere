import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Place from "../../Components/Place";
import { database } from "../../firebase";
import { onValue, ref } from "firebase/database";
import { getDatesInRange } from "../../utils";

const drawerWidth = 240;

export default function AddToItinerary(props) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selected, setSelected] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const { isOpen, handleClose, item, dates, trip, user, addToDate } = props;

  useEffect(() => {
    const dateRef = ref(database, `trips/${trip}/places`);
    onValue(dateRef, (data) => {
      // filter by selected dates
      const list = Object.values(data.val()).filter((item) => {
        if (item.date && item.date.trim() === selected) {
          return item;
        }
      });
      const tmp = [];
      setItinerary([...tmp, ...list]);
    });
  }, [selected]);

  // const getDatesInRange = (startDate, endDate) => {
  //   if (!startDate) return [];
  //   const date = new Date(startDate.getTime());
  //   const dates = [];

  //   while (date <= endDate) {
  //     dates.push(new Date(date).toLocaleDateString());
  //     date.setDate(date.getDate() + 1);
  //   }

  //   return dates;
  // };

  const showItinerary = itinerary.map((place) => {
    return <Place key={place.uid} item={place} user={user} />;
  });

  return (
    <Dialog open={isOpen} maxWidth="md" fullWidth={true}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add to Itinerary
        <IconButton onClick={() => handleClose()}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box
          name="selected place"
          sx={{
            backgroundColor: "#D3EEDC40",
            display: "flex",
            px: 2,
            py: 1,
          }}
        >
          <Box py={0.5} mr={1}>
            <LocationOnIcon />
          </Box>
          <Box width="100%">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6">{item ? item.name : ""}</Typography>
                <Typography variant="subtitle2">
                  Added by {item ? item.addedBy : ""}
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
                    SGD {item ? item.cost : ""}
                  </Typography>
                  <IconButton>
                    <FavoriteIcon sx={{ width: "22px", height: "22px" }} />
                  </IconButton>
                  {item ? item.likeCount : ""}
                </Box>
              </Box>
            </Box>
            <Box mt={1}>
              <Typography variant="body1">{item ? item.note : ""}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box>
            <Drawer
              PaperProps={{
                style: {
                  position: "relative",
                },
              }}
              variant="permanent"
              anchor="left"
              open={true}
            >
              <List>
                {dates.length >= 1 &&
                  getDatesInRange(dates[0], dates[1]).map((text, index) => (
                    <ListItem
                      button
                      key={text}
                      onClick={(e) => setSelected(e.target.innerText)}
                    >
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
              </List>
            </Drawer>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box width="100%">
            <h3>{selected}</h3>
            {showItinerary}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          className="btn-green"
          sx={{ color: "white" }}
          onClick={() => addToDate(item.uid, selected)}
        >
          Move here
        </Button>
      </DialogActions>
    </Dialog>
  );
}
