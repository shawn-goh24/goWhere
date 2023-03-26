import React, { forwardRef } from "react";
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
import { set } from "firebase/database";

const CollapseToggle = forwardRef(function CollapseToggle(props, ref) {
  const [open, setOpen] = React.useState(true);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setOpen(true);
    setIsDragOver(true);
    props.handleDragEnter(0);
  };

  const handleDragEnd = () => {
    setIsDragOver(false);
  };

  const handleDrop = () => {
    props.handleDrop(0, props.date, "toggle");
    setIsDragOver(false);
  };

  return (
    <div
      // onDrop={() => props.handleDrop(props.date)}
      // onDragOver={handleDragOver}
      // droppable
      ref={ref}
    >
      <ListItemButton
        onClick={handleClick}
        sx={{ p: "8px 8px 8px 0" }}
        ref={ref}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragEnd}
        droppable={"true".toString()}
      >
        {open ? (
          <ExpandLess style={{ marginRight: "5px" }} />
        ) : (
          <ExpandMore style={{ marginRight: "5px" }} />
        )}
        <Typography sx={{ fontWeight: "700" }}>{props.date}</Typography>
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
        {/* <div>
          <ListItemButton sx={{ p: 0 }}>{props.children}</ListItemButton>
        </div> */}
        <div
          style={{
            height: isDragOver ? "100px" : 0,
            transition: "all 0.5s",
          }}
        ></div>
        <List component="div" disablePadding>
          <ListItemButton sx={{ p: 0 }}>{props.children}</ListItemButton>
        </List>
        {/* {isDragOver && (
          <div style={{ height: "50px", transition: "all 0.8s" }}></div>
        )} */}
      </Collapse>
    </div>
  );
});

export default CollapseToggle;
