import { Container, Typography } from "@mui/material";
import React from "react";

export default function NotFound() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h3">Page Not Found</Typography>
      <img
        src="https://dlaignite.com/wp-content/uploads/2018/02/not-connected.jpg"
        alt="404"
        style={{ marginTop: "30px" }}
      />
    </Container>
  );
}
