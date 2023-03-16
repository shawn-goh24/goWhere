import React, { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Paper,
  Avatar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import ProfileStats from "../Components/ProfileStats";
import TripsBox from "../Components/TripsBox";
import { EditProfile } from "./EditProfile";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { createTripArr, calculateCountries, calculateTrips } from "../utils";

export default function Profile(props) {
  const { user, trips } = props;
  const [editOpen, setEditOpen] = useState(false);

  // Check if current screen size is xs
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  let userTrips = createTripArr(trips);

  const handleEditProfileOpen = () => {
    setEditOpen(true);
  };

  const handleEditProfileClose = () => {
    setEditOpen(false);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ marginTop: "50px" }}>
        <Paper
          elevation={4}
          sx={{
            backgroundColor: "#F2F2F2",
            borderRadius: "15px",
            height: "284px",
          }}
        >
          <Grid container>
            <Grid item xs={12} sx={{ height: "141px" }}>
              <img
                src={require(`../Assets/billy-williams-8wz1Q4Q_XAg-unsplash.jpg`)}
                alt="mountain"
                width="100%"
                height="141px"
                style={{ borderRadius: "15px 15px 0 0" }}
              />
            </Grid>
            <Grid container sx={{ height: "141px" }}>
              <Grid container justifyContent="space-around" alignItems="center">
                <Grid item>
                  <Grid
                    container
                    flexDirection="column"
                    alignItems="center"
                    sx={{ marginTop: "-90px" }}
                  >
                    <Grid item>
                      <Avatar
                        sx={{ width: 80, height: 80 }}
                        src={user.photoURL}
                      />
                    </Grid>
                    <Grid item sx={{ p: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
                        {user.displayName}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        className="btn-green"
                        sx={{ borderRadius: "15px" }}
                        onClick={handleEditProfileOpen}
                      >
                        Edit Profile
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                {isSmallScreen ? null : (
                  <>
                    <Grid item>
                      <ProfileStats data={calculateCountries(trips)}>
                        Countries Visited
                      </ProfileStats>
                    </Grid>
                    <Grid item>
                      <ProfileStats data={calculateTrips(trips)}>
                        Total Trips
                      </ProfileStats>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Container maxWidth="lg" sx={{ marginTop: "50px" }}>
        <Box sx={{ padding: "0 10px" }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Trips
            </Typography>
          </Box>
          <Grid container gap={8} sx={{ mt: 4 }}>
            {userTrips === null || userTrips.length < 1 ? (
              <Typography>No trips, go back to home to add trips</Typography>
            ) : (
              userTrips.map((trip, index) => {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={`${trip.country}-${index}`}
                  >
                    <TripsBox
                      trip={trip}
                      setTripGeolocation={props.setTripGeolocation}
                      setMapViewBound={props.setMapViewBound}
                    />
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>
      </Container>
      <EditProfile
        isOpen={editOpen}
        user={props.user}
        handleEditProfileClose={handleEditProfileClose}
        updateUserInfo={props.updateUserInfo}
      />
    </>
  );
}
