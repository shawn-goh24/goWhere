import React from "react";
import { Typography, Grid } from "@mui/material";

export default function ProfileStats(props) {
  return (
    <>
      <Grid
        container
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Grid item>
          <Typography sx={{ fontSize: "1.8rem", fontWeight: "700" }}>
            {props.data}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>{props.children}</Typography>
        </Grid>
      </Grid>
    </>
  );
}
