import React from "react";
import {
  Box,
  FormControl,
  Grid,
  OutlinedInput,
  TextField,
  Typography,
  Button,
  List,
  ListItemText,
  ListItemButton,
  Collapse,
} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

import Place from "./Place";

export default function CollapseToggle(props) {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handlePlaceClick = () => {
    console.log("Place clicked");
  };

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ p: "8px 8px 8px 0" }}>
        {open ? (
          <ExpandLess style={{ marginRight: "5px" }} />
        ) : (
          <ExpandMore style={{ marginRight: "5px" }} />
        )}
        <Typography sx={{ fontWeight: "700" }}>Monday, 7th August</Typography>
      </ListItemButton>
      <Collapse
        in={open}
        timeout={200}
        unmountOnExit
        easing={{
          enter: "linear",
          exit: "linear",
        }}
      >
        <List component="div" disablePadding>
          <ListItemButton sx={{ p: 0 }} onClick={handlePlaceClick}>
            {/* <Place /> */}
            Hi
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
