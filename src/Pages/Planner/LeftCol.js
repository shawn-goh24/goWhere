// import * as React from "react";
import React, { useEffect, useState } from "react";
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
import { Paper } from "@mui/material";
import { database } from "../../firebase";
import { getDatesInRange } from "../../utils";

import { onValue, ref } from "firebase/database";

const drawerWidth = 240;

function LeftCol(props) {
  const { window, interest, resetInterest } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selection, setSelection] = useState("Interested Places");
  const [tripDetails, setTripDetails] = useState(null);

  const { trip, user } = props;

  useEffect(() => {
    const tripRef = ref(database, `trips/${trip}`);
    onValue(tripRef, (snapshot) => {
      setTripDetails(snapshot.val());
    });
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getSelection = (e) => {
    console.log(e.target.innerText);
    setSelection(e.target.innerText);
  };

  const drawer = (
    <div>
      <Divider />
      <List>
        {["Interested Places", "Packing List", "Documents"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={getSelection}>
                <ListItemIcon>
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
            <ListItemButton onClick={getSelection}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {tripDetails
          ? getDatesInRange(
              new Date(tripDetails.startDate),
              new Date(tripDetails.endDate)
            ).map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={getSelection}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))
          : ""}
      </List>
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
        />
      );
    } else if (selection === "Packing List") {
      return <PackingList />;
    } else if (selection === "Documents") {
      return <Documents />;
    } else if (selection === "Itinerary") {
      return <Itinerary trips={props.trips} />;
    }
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
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
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // mt: "64px",
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          maxHeight: "calc(100vh - 64px)", // original is 100vh
          overflowX: "hidden",
          overflowY: "auto",
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
              <Typography variant="subtitle" component="p">
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
