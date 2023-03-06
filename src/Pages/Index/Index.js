import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import React from "react";
import hero from "../../Assets/hero-1920x890.png";
import "./Index.css";

export function Index() {
  return (
    <Container maxWidth="lg">
      <Grid container sx={{ m: "5px" }}>
        <Grid>
          <img
            src={hero}
            alt="hero"
            width="100%"
            style={{ borderRadius: "30px" }}
          />
        </Grid>
        <Grid lg={11}>
          <Paper elevation={8} sx={{ display: "flex", p: "20px" }}>
            <Grid>
              <TextField
                id="filled-basic"
                label="Destination"
                variant="filled"
                sx={{ mr: "20px" }}
              />
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid container>
              <TextField
                id="filled-basic"
                label="Start Date"
                variant="filled"
                sx={{ mr: "20px" }}
              />
              <TextField
                id="filled-basic"
                label="End Date"
                variant="filled"
                sx={{ mr: "20px" }}
              />
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid>
              <TextField
                id="filled-basic"
                label="Budget"
                variant="filled"
                sx={{ mr: "20px" }}
              />
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Button>Plan Now</Button>
          </Paper>
        </Grid>
      </Grid>
      <Box className="layout" sx={{ backgroundColor: "blue", height: "100px" }}>
        Details
      </Box>
      <Box
        className="layout"
        sx={{ backgroundColor: "green", height: "100px" }}
      >
        destinations
      </Box>
      <Box
        className="layout"
        sx={{ backgroundColor: "yellow", height: "100px" }}
      >
        footer
      </Box>
    </Container>
  );
}
