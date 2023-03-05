import { Box } from "@mui/material";
import React from "react";
import hero from "../../Assets/hero-image.jpg";

export function Index() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "55%",
      }}
    >
      <img
        src={hero}
        alt="hero"
        width="100%"
        height="531px"
        style={{ borderRadius: "30px" }}
      />
    </Box>
  );
}
