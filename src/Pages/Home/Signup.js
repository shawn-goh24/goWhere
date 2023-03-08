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
import { auth, database } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";

const DB_USERS_KEY = "users";

export function Signup(props) {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isOpen, handleDialog } = props;

  const handleSignup = (event) => {
    event.preventDefault();

    // const newUser = {
    //   email: email,
    //   userId: 123,
    // };

    // const userRef = ref(database, `${DB_USERS_KEY}/test`);
    // set(userRef, newUser);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const newUser = {
          email: email,
          userId: userCredential.user.uid,
        };
        const userRef = ref(
          database,
          `${DB_USERS_KEY}/${userCredential.user.uid}`
        );
        set(userRef, newUser);
      })
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: username,
        })
          .then(() => {
            console.log("Username added");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
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
                onSubmit={handleSignup}
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
