import React, { forwardRef } from "react";
import { Typography, List, ListItemButton, Collapse } from "@mui/material";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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
    <div ref={ref}>
      <ListItemButton
        onClick={handleClick}
        sx={{ p: "8px 8px 8px 0" }}
        style={{
          minHeight: isDragOver ? "100px" : "60px",
          transition: "all 0.5s",
        }}
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
        <div
          style={{
            height: isDragOver ? "150px" : 0,
            transition: "all 0.5s",
          }}
        ></div>
        <List component="div" disablePadding>
          {props.children}
        </List>
      </Collapse>
    </div>
  );
});

export default CollapseToggle;
