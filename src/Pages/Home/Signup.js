import {
  Avatar,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  DialogTitle,
  CircularProgress,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { setErrorMessage } from "../../utils";

import { auth, database, storage } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { get, ref, set, runTransaction, onValue } from "firebase/database";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";

const DB_USERS_KEY = "users";

export function Signup(props) {
  const [avatar, setAvatar] = useState("");
  const [tmpUrl, setTmpUrl] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { isOpen, handleDialog } = props;

  const handleClose = () => {
    handleDialog();
    setErrorMsg();
    setLoading(false);
  };

  const handleSignup = (event) => {
    event.preventDefault();

    setLoading(true);

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

        // check for new user shared trips
        const tripsRef = ref(database, `trips`);
        const sharedTrips = [];
        get(tripsRef).then((data) => {
          const trips = Object.values(data.val());
          for (let i = 0; i < trips.length; i++) {
            const tmp = email;
            const editedEmail = tmp.replace(".", "*");
            if (trips[i].members) {
              if (Object.keys(trips[i].members).includes(editedEmail)) {
                sharedTrips.push(trips[i].tripId);
              }
            } else {
              console.log("no shared trips");
            }
          }

          const userShareRef = ref(
            database,
            `users/${userCredential.user.uid}`
          );
          for (let j = 0; j < sharedTrips.length; j++) {
            runTransaction(userShareRef, (user) => {
              if (user) {
                console.log(user);
                if (user.sharedTrips && user.sharedTrips[sharedTrips[j]]) {
                  console.log("user exist in trips");
                } else {
                  if (!user.sharedTrips) {
                    user.sharedTrips = {};
                  }
                  user.sharedTrips[sharedTrips[j]] = true;
                }
              }
              return user;
            });
          }
        });
        return userCredential.user.uid;
      })
      .then((userUid) => {
        const storageRef = sRef(storage, `avatar/${email}`);
        uploadBytes(storageRef, avatar).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((avatarUrl) => {
            // store avatarUrl to users db
            const currUserRef = ref(database, `users/${userUid}/avatarUrl`);
            set(currUserRef, avatarUrl);

            props.updateUserInfo(username, email, avatarUrl, userUid);
            updateProfile(auth.currentUser, {
              photoURL: avatarUrl,
              displayName: username,
            })
              .then(() => {
                console.log("Username and Avatar added");
                // reset state
                setTmpUrl("");
                setAvatar("");
                setErrorMsg("");
                setLoading(false);
                handleDialog();
              })
              .catch((error) => {
                console.log(error);
                const errorMsg = setErrorMessage(error.code);
                setErrorMsg(errorMsg);
                setLoading(false);
              });
          });
        });
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = setErrorMessage(error.code);
        setErrorMsg(errorMsg);
        setLoading(false);
      });
  };

  const uploadAvatar = (event) => {
    setAvatar(event.target.files[0]);
    setTmpUrl(event.target.files[0]);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: 400, // Set width here
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 1, mt: 1 }}>
          <IconButton name="signup" onClick={handleClose}>
            <CloseIcon sx={{ color: "#CCCCCC" }} />
          </IconButton>
        </Box>
        <DialogContent
          sx={{
            width: "100%",
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
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            rowSpacing={3}
            sx={{ p: "24px 24px 10px 24px" }}
          >
            <Grid item>
              <IconButton name="addAvatar" component="label">
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={uploadAvatar}
                />
                <Box>
                  <Avatar
                    // create temporary image url
                    src={avatar ? URL.createObjectURL(tmpUrl) : ""}
                    sx={{ width: "135px", height: "135px" }}
                  />
                  <AddCircleIcon
                    sx={{ position: "absolute", right: 12, bottom: 14 }}
                  />
                </Box>
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <form
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={handleSignup}
              >
                <TextField
                  required
                  label="Username"
                  name="text"
                  type="text"
                  placeholder="Username"
                  onChange={(event) => setUsername(event.target.value)}
                />
                <br />
                <TextField
                  required
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <br />
                <TextField
                  required
                  label="Password"
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
                  {loading ? (
                    <CircularProgress size={24} style={{ color: "#FFFFFF" }} />
                  ) : (
                    "Signup"
                  )}
                </Button>
              </form>
              {errorMsg === "" ? null : (
                <Typography
                  sx={{ color: "maroon", textAlign: "center", mt: 2 }}
                >
                  {errorMsg}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
