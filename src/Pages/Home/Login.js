import {
  Button,
  Dialog,
  DialogContent,
  Input,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import React, { useState } from "react";

export function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(email, password);
  };

  return (
    <>
      <Dialog open={true}>
        <DialogContent
          sx={{
            width: 300,
            mx: "auto", // margin left & right
            mt: 2, // margin top & botom
            pt: 3, // padding top & bottom
            px: 2, // padding left & right
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "sm",
            boxShadow: "md",
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            rowSpacing={3}
          >
            <Grid item>
              <Typography variant="h3" sx={{ fontFamily: "Work Sans" }}>
                <b>Hola!</b>
              </Typography>
            </Grid>
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
                <a href="#" style={{ color: "#77a690" }}>
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
