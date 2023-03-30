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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Typography from "@mui/material/Typography";
import AddToItinerary from "./AddToItinerary";
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
  Grid,
} from "@mui/material";
import { database } from "../../firebase";
import {
  getDatesInRange,
  resetDates,
  getPlaces,
  sortPlaces,
  createUpdateObj,
  createArray,
  generateNextId,
  findDuplicate,
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

const drawerWidth = 210;

function LeftCol(props) {
  const { window, interest, resetInterest } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selection, setSelection] = useState("Interested Places");
  const [tripDetails, setTripDetails] = useState(null);
  const [item, setItem] = useState([]);
  const [scrollTarget, setSrcollTarget] = useState(null);
  const [selectedIndex, getSelectedIndex] = useState("Interested Places");
  const [coverImg, setCoverImg] = useState("");
  const [snackStatus, setSnackStatus] = useState({
    open: false,
    msg: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // Add to Itinerary States
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dates, setDates] = useState([]);
  const [source, setSource] = useState("");

  const datesRef = useRef(null);

  const { trip, user } = props;

  useEffect(() => {
    const tripRef = ref(database, `trips/${trip}`);
    onValue(tripRef, (snapshot) => {
      setTripDetails(snapshot.val());
      setCoverImg(snapshot.val().coverImgUrl);
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
        {["Interested Places"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={selectedIndex === text}
              onClick={(e) => {
                getSelection(e.target.innerText);
                getSelectedIndex(e.target.innerText);
              }}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#a5c4b6",
                },
                "&.Mui-focusVisible": {
                  backgroundColor: "#77A690",
                },
                ":hover": {
                  backgroundColor: "#d3e2db",
                },
              }}
            >
              {console.log(text)}
              <ListItemIcon sx={{ minWidth: "30px" }}>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Itinerary"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={selectedIndex === text}
              onClick={(e) => {
                getSelection(e.target.innerText);
                getSelectedIndex(e.target.innerText);
              }}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#a5c4b6",
                },
                "&.Mui-focusVisible": {
                  backgroundColor: "#77A690",
                },
                ":hover": {
                  backgroundColor: "#d3e2db",
                },
              }}
            >
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
          handleAddItinerary={handleAddItinerary}
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
          isSmallScreen={props.isSmallScreen}
          handleAddItinerary={handleAddItinerary}
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
    }).then(() => {
      setDialogOpen(false);
    });
  };

  const updatePlaceNum = (date) => {
    const placeRef = ref(database, `trips/${trip}/places`);
    return get(placeRef)
      .then((snapshot) => {
        const placesInDay = sortPlaces(
          getPlaces(createArray(snapshot.val()), date)
        );
        return placesInDay;
      })
      .then((placesArr) => {
        const placesObj = createUpdateObj(placesArr);
        return placesObj;
      })
      .then((placesObj) => {
        update(placeRef, placesObj);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAddItinerary = (item, source) => {
    setIsOpen(!isOpen);
    setSelected(item);
    setSource(source);

    const tmpDates = [];
    setDates(...tmpDates, [tripDetails.startDate, tripDetails.endDate]);
    // console.log(item);
  };

  const handleAddToItineraryClose = () => {
    setIsOpen(!isOpen);
  };

  const addToDate = (placeId, selectedDate) => {
    const addToDateRef = ref(database, `trips/${trip}/places/${placeId}`);
    const placesRef = ref(database, `trips/${trip}/places`);
    const date = { date: selectedDate };

    get(placesRef)
      .then((snapshot) => {
        let positionId = 0;
        if (snapshot.exists()) {
          const data = createArray(snapshot.val());
          const existingPlaces = getPlaces(data, selectedDate);
          const isDuplicated = findDuplicate(existingPlaces, placeId);
          if (!isDuplicated[0] && existingPlaces.length > 0) {
            positionId = generateNextId(existingPlaces);
          } else {
            console.log("Get no Data");
          }
          return positionId;
        }
      })
      .then((positionNum) => {
        runTransaction(addToDateRef, (place) => {
          place.position = positionNum;
          if (place) {
            if (place.date) {
              place.date = selectedDate;
            } else if (!place.date) {
              place.date = selectedDate;
            }
          }
          return place;
        });
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
        <Box
          component="nav"
          sx={{
            width: { md: drawerWidth },
            flexShrink: { sm: 0 },
          }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={props.isSideBarOpen}
            // open={mobileOpen}
            onClose={props.handleSideOpen}
            // onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
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
              display: { xs: "none", md: "flex" },
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
                src={coverImg}
                alt="cover"
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
                {tripDetails ? (
                  <div style={{ display: "flex" }} onClick={handleDatesClick}>
                    <IconButton aria-label="calendar-button">
                      <CalendarMonthIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                    <Typography
                      sx={{
                        fontSize: "0.9375rem",
                        cursor: "pointer",
                        margin: "auto",
                      }}
                    >{`${tripDetails.startDate} - ${tripDetails.endDate}`}</Typography>
                  </div>
                ) : (
                  "Error"
                )}
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
        onClose={() => setDialogOpen(false)}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              padding: "5px",
            },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>Change Date</DialogTitle>
        <DialogContent style={{ paddingTop: "10px" }}>
          <Typography sx={{ mb: 4 }}>
            Changing dates will reset your itinerary.
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <DesktopDatePicker
                  label="Start Date"
                  sx={{
                    width: { xs: "100%", sm: "175px" },
                    mr: "15px",
                    mb: { xs: 2, sm: 0 },
                  }}
                  onChange={(date) => setStartDate(onDateChange(date))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DesktopDatePicker
                  label="End Date"
                  sx={{ width: { xs: "100%", sm: "175px" } }}
                  onChange={(date) => setEndDate(onDateChange(date))}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button
            className="btn-green"
            autoFocus
            onClick={handleChangeDate}
            style={{ color: "#FFFFFF" }}
          >
            Change Date
          </Button>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: "black" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <AddToItinerary
        isOpen={isOpen}
        handleClose={handleAddToItineraryClose}
        item={selected}
        dates={dates}
        trip={trip}
        user={user}
        addToDate={addToDate}
        source={source}
      />
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
