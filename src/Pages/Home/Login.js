import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  Input,
  Typography,
  Grid,
  Divider,
  DialogTitle,
  Box,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";

export function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isOpen, handleDialog } = props;

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(email, password);
  };

  return (
    <>
      <Dialog open={isOpen}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton name="login" onClick={handleDialog}>
            <CloseIcon name="login" sx={{ color: "#CCCCCC" }} />
          </IconButton>
        </Box>
        <DialogContent
          sx={{
            width: 300,
            mx: "auto", // margin left & right
            p: "0px",
            pb: 2, // padding bottom
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "center",
              fontFamily: "Work Sans",
              fontWeight: "bold",
              fontSize: "40px",
              p: "0px",
            }}
          >
            Hola!
          </DialogTitle>
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            rowSpacing={3}
          >
            <Grid item>
              <form
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={handleSubmit}
              >
                <Input
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <br />
                <Input
                  required
                  name="password"
                  type="password"
                  placeholder="Password"
                  variant="outlined"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <br />
                <Button
                  className="btn-green"
                  sx={{ color: "white" }}
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </Grid>
            <Grid item>
              <Divider flexItem />
              <Typography variant="subtitle">
                Don't have an account?{" "}
                <a onClick={handleDialog} style={{ color: "#77a690" }}>
                  Signup
                </a>
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
