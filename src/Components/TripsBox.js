import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

export default function TripsBox(props) {
  return (
    <>
      <Card sx={{ maxWidth: 345, borderRadius: "15px" }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image="https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80"
            alt="tokyo"
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              Japan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1 - 15 August 2023
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
