import {
  Avatar,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Input,
  Button,
} from "@mui/material";
import React, { useState } from "react";

export function Signup() {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(username, email, password);
  };

  return (
    <>
      <Dialog open={true}>
        <DialogContent>
          <Grid container direction="column" alignItems="center" rowSpacing={3}>
            <Grid item>
              <Typography variant="h4">Join us!</Typography>
            </Grid>
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
