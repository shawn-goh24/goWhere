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
import CollapseToggle from "../../Components/CollaspeToggle";

export default function Itinerary(props) {
  console.log(props.trips);

  return (
    <>
      <Box sx={{ p: "0 10px" }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
          Itinerary
        </Typography>
        <CollapseToggle />
      </Box>
    </>
  );
}
