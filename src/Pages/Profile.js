import React from "react";
import {
  Grid,
  Container,
  Paper,
  Avatar,
  Button,
  Typography,
} from "@mui/material";
import ProfileStats from "../Components/ProfileStats";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Profile(props) {
  // Check if current screen size is xs
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
                      <Avatar sx={{ width: 80, height: 80 }} />
                    </Grid>
                    <Grid item sx={{ p: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
                        John Smith
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
    </>
  );
}
