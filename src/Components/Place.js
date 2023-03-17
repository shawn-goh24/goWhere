import { Box, IconButton, Paper, Typography } from "@mui/material";
import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";

export default function Place(props) {
  return (
    <Box>
      <Paper
        elevation={0}
        // variant="outlined"
        sx={{
          backgroundColor: "#D3EEDC40",
          display: "flex",
          p: "5px",
        }}
      >
        <Box py={0.5} mr={1}>
          <LocationOnIcon />
        </Box>
        <Box width="100%">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6">
                Honke Nishio Yatsuhashi Kiyomizuzaka
              </Typography>
              <Typography variant="subtitle2">Added by Son</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ color: "#733D29" }}>
                  SGD 5000
                </Typography>
                <IconButton>
                  <FavoriteIcon sx={{ width: "22px", height: "22px" }} />
                  {/* <Typography variant="body1">0</Typography> */}
                </IconButton>
                0
                <IconButton>
                  <AddIcon sx={{ width: "22px", height: "22px" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box mt={1}>
            <Typography variant="body1">
              A popular sightseeing path runs uphill through this forest of
              towering bamboo stalks.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
