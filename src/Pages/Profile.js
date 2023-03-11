import React, { useState } from "react";
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

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Tab, Tabs } from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";

export default function Profile(props) {
  const { user } = props;

  // Check if current screen size is xs
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
                      >
                        Edit Profile
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                {isSmallScreen ? null : (
                  <>
                    <Grid item>
                      <ProfileStats data={2}>Countries Visited</ProfileStats>
                    </Grid>
                    <Grid item>
                      <ProfileStats data={3}>Completed Trips</ProfileStats>
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
          <Box sx={{ width: "100%" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  textColor="primary"
                  indicatorColor="primary"
                  onChange={handleChange}
                  value={value}
                >
                  <Tab label="Upcoming" value="1" />
                  <Tab label="Completed" value="2" />
                </Tabs>
              </Box>
              <TabPanel value="1" sx={{ padding: "24px 0" }}>
                <Grid container gap={8}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TripsBox />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TripsBox />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TripsBox />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TripsBox />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="2" sx={{ padding: "24px 0" }}>
                <Grid container gap={8}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TripsBox />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TripsBox />
                  </Grid>
                </Grid>
              </TabPanel>
            </TabContext>
          </Box>
        </Box>
      </Container>
    </>
  );
}
