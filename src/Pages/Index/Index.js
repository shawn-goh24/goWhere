import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  Paper,
  TextField,
  Input,
  Typography,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventNoteIcon from "@mui/icons-material/EventNote";
import React from "react";
import hero from "../../Assets/hero-1920x890.png";
import paris from "../../Assets/paris.jpg";
import "./Index.css";

export default function Index() {
  return (
    <>
      <Container>
        <Grid container>
          <Grid item>
            <img
              src={hero}
              alt="hero"
              width="100%"
              style={{ borderRadius: "30px" }}
            />
          </Grid>
          <Grid item>
            <Paper
              elevation={8}
              sx={{
                display: "flex",
                p: "10px",
                position: "relative",
                top: "-55px",
                left: "100px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  m: "10px",
                }}
              >
                <FmdGoodIcon sx={{ color: "#77a690" }} />
                <TextField
                  id="filled-basic"
                  placeholder="Enter Location"
                  variant="standard"
                  sx={{ width: "215px" }}
                />
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Start Date"
                    sx={{ width: "175px", m: "10px" }}
                  />
                  <DesktopDatePicker
                    label="End Date"
                    sx={{ width: "175px", m: "10px" }}
                  />
                </LocalizationProvider>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  m: "10px",
                }}
              >
                <AttachMoneyIcon sx={{ color: "#77a690" }} />
                <FormControl>
                  <Input
                    placeholder="Budget"
                    id="standard-adornment-amount"
                    type="number"
                    sx={{ width: "175px" }}
                  />
                </FormControl>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Button
                className="btn-green"
                variant="contained"
                size="small"
                sx={{ m: "10px" }}
              >
                Plan Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ backgroundColor: "#F2F2F2" }}>
        <Container maxWidth="lg">
          <Grid
            container
            minHeight={300}
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item>
              <Box sx={{ width: "205px" }}>
                <EventNoteIcon
                  sx={{ width: "70px", height: "70px", color: "#77a690" }}
                />
                <Typography variant="h5" sx={{ fontWeight: "700" }}>
                  PLAN YOUR MOVE
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ width: "205px" }}>
                <EventNoteIcon
                  sx={{ width: "70px", height: "70px", color: "#77a690" }}
                />
                <Typography variant="h5" sx={{ fontWeight: "700" }}>
                  SHARE THE ADVENTURE
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ width: "205px" }}>
                <EventNoteIcon
                  sx={{ width: "70px", height: "70px", color: "#77a690" }}
                />
                <Typography variant="h5" sx={{ fontWeight: "700" }}>
                  CHOOSE YOUR DESTINY
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box>
        <Container maxWidth="lg">
          <Grid
            container
            minHeight={500}
            direction="column"
            alignItems="center"
            justifyContent="space-around"
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <div className="line" />
                <Typography variant="h4">Destination</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <img src={paris} alt="paris" className="destination" />
              <img src={paris} alt="paris" className="destination" />
              <img src={paris} alt="paris" className="destination" />
              <img src={paris} alt="paris" className="destination" />
              <img src={paris} alt="paris" className="destination" />
            </Box>
            <Box>
              <Typography variant="h5">And many more ...</Typography>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Box className="layout" sx={{ backgroundColor: "#F2F2F2" }}>
        <Typography variant="subtitle2">FOR PROJECT PURPOSE ONLY</Typography>
      </Box>
    </>
  );
}
