// import * as React from "react";
import React, { useEffect, useState, useRef, forwardRef } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NavBar from "../../Components/NavBar";
import InterestedPlaces from "./InterestedPlaces";
import PackingList from "./PackingList";
import Documents from "./Documents";
import Itinerary from "./Itinerary";
import {
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";
import { database } from "../../firebase";
import {
  getDatesInRange,
  resetDates,
  getPlaces,
  sortPlaces,
  createUpdateObj,
  createArray,
} from "../../utils";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineItemClasses,
} from "@mui/lab";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { onValue, ref, runTransaction, get, update } from "firebase/database";
import SharedGroup from "../../Components/SharedGroup";

const drawerWidth = 190;

function LeftCol(props) {
  const { window, interest, resetInterest } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selection, setSelection] = useState("Interested Places");
  const [tripDetails, setTripDetails] = useState(null);
  const [item, setItem] = useState([]);
  const [scrollTarget, setSrcollTarget] = useState(null);
  const [snackStatus, setSnackStatus] = useState({
    open: false,
    msg: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const datesRef = useRef(null);

  const { trip, user } = props;

  useEffect(() => {
    const tripRef = ref(database, `trips/${trip}`);
    onValue(tripRef, (snapshot) => {
      setTripDetails(snapshot.val());
    });
  }, []);

  useEffect(() => {
    const placeRef = ref(database, `trips/${trip}/places`);
    onValue(placeRef, (data) => {
      if (data.val()) {
        const tmpItem = [];
        setItem([...tmpItem, ...Object.values(data.val())]);
      }
    });
    getMap();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getSelection = (e) => {
    setSelection(e);
    // If user moves to other sections,
    // reset the scrollTarget so that useEffect will detect the change
    // when user clicks back to the same date set in previous scrollTarget
    if (e !== "Itinerary" && scrollTarget !== null) {
      setSrcollTarget(null);
    }
  };

  // Only runs if scrollTarget changes
  useEffect(() => {
    //console.log(`scrollTarget: ${scrollTarget}`);
    if (scrollTarget !== null && scrollTarget !== undefined) {
      const node = datesRef.current.get(scrollTarget);
      // If a node is found, scroll to the node,
      // else stay on Itinerary page
      //console.log(datesRef);
      //console.log(`Node: ${node}`);
      if (node) {
        node.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [scrollTarget]);

  const scrollTo = (selection) => {
    //If it is currently showing other sections,
    // set the section to Itinerary before scrolling to the specific date
    if (selection !== "Itinerary") {
      getSelection("Itinerary");
    }

    setSrcollTarget(selection);
  };

  // Set datesRef to map
  // To store ref of each date
  const getMap = () => {
    if (!datesRef.current) {
      // Initialize the Map on first usage.
      datesRef.current = new Map();
    }
    return datesRef.current;
  };

  const updateDateRef = (date, node) => {
    if (node) {
      datesRef.current.set(date, node);
    } else {
      datesRef.current.delete(date);
    }
  };

  const datesArray = tripDetails
    ? getDatesInRange(tripDetails.startDate, tripDetails.endDate)
    : null;

  const datesArrayLastItem = datesArray !== null ? datesArray.length - 1 : null;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackStatus({ open: false, msg: "" });
  };

  const drawer = (
    <div>
      <Divider />
      <List>
        {["Interested Places", "Packing List", "Documents"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={(e) => getSelection(e.target.innerText)}>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
      <List>
        {["Itinerary"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={(e) => getSelection(e.target.innerText)}>
              <ListItemIcon sx={{ minWidth: "30px" }}>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 1,
          },
          m: 0,
        }}
      >
        {datesArray &&
          datesArray.map((text, index) => (
            <TimelineItem key={text}>
              <TimelineSeparator>
                <TimelineDot />
                {index !== datesArrayLastItem ? <TimelineConnector /> : null}
              </TimelineSeparator>
              <TimelineContent
                onClick={() => scrollTo(text)}
                sx={{ cursor: "pointer" }}
              >
                {text}
              </TimelineContent>
            </TimelineItem>
          ))}
      </Timeline>
    </div>
  );

  const content = () => {
    if (selection === "Interested Places") {
      return (
        <InterestedPlaces
          interest={interest}
          tripDetails={tripDetails}
          trip={trip}
          user={user}
          resetInterest={resetInterest}
          item={item}
          snackStatus={snackStatus}
          setSnackStatus={setSnackStatus}
          updatePlaceNum={updatePlaceNum}
        />
      );
    } else if (selection === "Packing List") {
      return <PackingList />;
    } else if (selection === "Documents") {
      return <Documents />;
    } else if (selection === "Itinerary") {
      return (
        <Itinerary
          tripDetails={tripDetails}
          user={user}
          trip={trip}
          item={item}
          updateDateRef={updateDateRef}
          setSelection={setSelection}
          snackStatus={snackStatus}
          setSnackStatus={setSnackStatus}
          updatePlaceNum={updatePlaceNum}
        />
      );
    }
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleDatesClick = () => {
    console.log("Dates Clicked");
    setDialogOpen(true);
  };

  const onDateChange = (date) => {
    const newMonth = date["$M"] + 1;
    const newDate = `${date["$D"]}/${newMonth}/${date["$y"]}`;
    console.log(newDate);
    return newDate;
  };

  const handleChangeDate = () => {
    const tripRef = ref(database, `trips/${trip}`);
    runTransaction(tripRef, (trip) => {
      if (trip) {
        trip.startDate = startDate;
        trip.endDate = endDate;
      }
      return trip;
    });
    const placesRef = ref(database, `trips/${trip}/places`);
    runTransaction(placesRef, (places) => {
      if (places) {
        places = resetDates(places);
      }
      return places;
    });
  };

  const updatePlaceNum = (date) => {
    const placeRef = ref(database, `trips/${trip}/places`);
    return get(placeRef)
      .then((snapshot) => {
        const placesInDay = sortPlaces(
          getPlaces(createArray(snapshot.val()), date)
        );
        // if (placesInDay.length === 0) {
        //   throw new Error("No Array");
        // }
        return placesInDay;
      })
      .then((placesArr) => {
        const placesObj = createUpdateObj(placesArr);
        console.log("Inside updatePlaceNum - createUpdateObj");
        console.log(placesObj);
        return placesObj;
      })
      .then((placesObj) => {
        console.log("Inside updatePlaceNum - update");
        update(placeRef, placesObj);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          overflowY: "auto",
          height: "calc(100vh - 64px)",
          // backgroundColor: "red",
        }}
      >
        <CssBaseline />
        {/* <AppBar
        position="fixed"
        sx={{
          ml: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "white",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <NavBar isPlanner={true} />
        </Toolbar>
      </AppBar> */}
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
          }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            PaperProps={{
              style: {
                position: "relative",
              },
            }}
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "flex" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                justifyContent: "space-between",
              },
              height: "calc(100vh - 64px)",
              flexDirection: "column",
            }}
            open
          >
            <Box>{drawer}</Box>
            <SharedGroup
              tripId={trip}
              // location={tripDetails.country}
              user={user}
            />
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // mt: "64px",
            // width: { sm: `calc(100% - ${drawerWidth}px)` },
            height: "100%", // original is 100vh
            // maxHeight: "calc(100vh - 64px)", // original is 100vh
            overflowX: "hidden",
            //overflowY: "auto",
          }}
        >
          {/* <Toolbar /> */}
          <Box>
            <Box>
              <img
                src="https://media.istockphoto.com/id/876560704/photo/fuji-japan-in-spring.jpg?s=612x612&w=0&k=20&c=j1VZlzfNcsjQ4q4yHXJEohSrBZJf6nUhh2_smM4eioQ="
                alt="japan"
                style={{ width: "100%", height: "275px", objectFit: "cover" }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Paper
                elevation={6}
                sx={{
                  px: "40px",
                  py: "15px",
                  position: "relative",
                  bottom: "50px",
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" component="h1">
                  {tripDetails ? `${tripDetails.country}` : "Error"}
                </Typography>
                <Typography
                  variant="subtitle"
                  component="p"
                  onClick={handleDatesClick}
                >
                  {tripDetails
                    ? `${tripDetails.startDate} - ${tripDetails.endDate}`
                    : "Error"}
                </Typography>
              </Paper>
            </Box>
          </Box>
          {content()}
        </Box>
      </Box>
      <Snackbar
        open={snackStatus.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} sx={{ width: "100%" }}>
          {snackStatus.msg}
        </Alert>
      </Snackbar>
      <Dialog
        open={dialogOpen}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              padding: "5px",
            },
          },
        }}
      >
        <DialogTitle>Change Date</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Start Date"
              sx={{ width: "175px", mr: "15px" }}
              onChange={(date) => setStartDate(onDateChange(date))}
            />
            <DesktopDatePicker
              label="End Date"
              sx={{ width: "175px" }}
              onChange={(date) => setEndDate(onDateChange(date))}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button className="btn-green" autoFocus onClick={handleChangeDate}>
            Change Date
          </Button>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: "black" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

LeftCol.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default LeftCol;
