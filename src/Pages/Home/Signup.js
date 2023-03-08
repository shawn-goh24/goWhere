import {
  Avatar,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Input,
  Button,
  Box,
  IconButton,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export function Signup(props) {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isOpen, handleDialog } = props;

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(username, email, password);
  };

  return (
    <>
      <Dialog open={isOpen}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton name="signup" onClick={handleDialog}>
            <CloseIcon name="signup" sx={{ color: "#CCCCCC" }} />
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
            Join us!
          </DialogTitle>
          <Grid container direction="column" alignItems="center" rowSpacing={3}>
            <Grid item>
              <Avatar sx={{ width: "135px", height: "135px" }} />
            </Grid>
            <Grid item>
              <form
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={handleSubmit}
              >
                <Input
                  required
                  name="text"
                  type="text"
                  placeholder="Username"
                  onChange={(event) => setUsername(event.target.value)}
                />
                <br />
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
                  Signup
                </Button>
              </form>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
