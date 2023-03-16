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
  TextField,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { setErrorMessage } from "../utils";

import { auth, database, storage } from "../firebase";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { ref, update } from "firebase/database";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";

const DB_USERS_KEY = "users";

export function EditProfile(props) {
  const [avatar, setAvatar] = useState("");
  const [tmpUrl, setTmpUrl] = useState(props.user.photoURL);
  const [username, setUsername] = useState(props.user.displayName);
  const [email, setEmail] = useState(props.user.email);
  const [newPassword, setNewPassword] = useState("");
  const [currPassword, setCurrPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { isOpen } = props;

  const handleClick = () => {
    props.handleEditProfileClose();
    setErrorMsg();
    setLoading(false);
  };

  const handleSignup = (event) => {
    event.preventDefault();

    setLoading(true);

    let userNewInfo = {};

    const storageRef = sRef(storage, `avatar/${email}`);

    // Get the user's current email and password for reauthentication
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currPassword
    );

    // Reauthenticate user first in case it needs to update password or email
    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        return new Promise((resolve, reject) => {
          // If user uploads a new profile image
          // then upload it onto database and get the download url
          if (avatar !== "") {
            uploadBytes(storageRef, avatar).then((snapshot) => {
              resolve(getDownloadURL(snapshot.ref));
            });
          } else {
            resolve(false);
          }
        });
      })
      .then((photoURL) => {
        // If there is a new photo url,
        // save it to new user object which will be used to update Firebase Auth
        if (photoURL) {
          userNewInfo = {
            photoURL: photoURL,
            displayName: username,
          };
          // Temporary update user profile in state until next render
          props.updateUserInfo(username, email, photoURL);
        } else {
          userNewInfo = {
            displayName: username,
          };
          // Temporary update user profile in state until next render
          props.updateUserInfo(username, email, "");
        }
        // Update Firebase Auth with new user name and image url
        return updateProfile(auth.currentUser, userNewInfo);
      })
      .then(() => updateEmail(auth.currentUser, email)) // Update user email regardless if there is a new email input
      .then(() => {
        return new Promise((resolve, reject) => {
          // If user entered a new password,
          // Update the password to Firebase Auth
          if (
            newPassword.length > 0 &&
            newPassword !== null &&
            newPassword !== undefined
          ) {
            resolve(updatePassword(auth.currentUser, newPassword));
          } else {
            // If user did not input new password,
            // just resolve this promise and move on to the next
            resolve(true);
          }
        });
      })
      .then(() => {
        //Update Firebase Realtime Database user's section
        const userRef = ref(database, DB_USERS_KEY + `/${props.user.uid}`);
        const newUser = {
          email: email,
          userId: props.user.uid,
        };
        return update(userRef, newUser);
      })
      .then(() => {
        console.log("profile updated");
        props.handleEditProfileClose();
        // reset state
        setTmpUrl("");
        setAvatar("");
        setErrorMsg("");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.code);
        const errorMsg = setErrorMessage(error.code);
        setErrorMsg(errorMsg);
        setLoading(false);
      });
  };

  const uploadAvatar = (event) => {
    const previewImage = URL.createObjectURL(event.target.files[0]);
    setAvatar(event.target.files[0]);
    setTmpUrl(previewImage);
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
          <IconButton name="signup" onClick={handleClick}>
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
              fontSize: "30px",
              p: "0px",
            }}
          >
            Edit Profile
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
                    src={tmpUrl}
                    sx={{ width: "135px", height: "135px" }}
                  />
                  <CameraAltIcon
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
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <br />
                <TextField
                  required
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <br />
                <TextField
                  required
                  label="Current Password"
                  name="curr-password"
                  type="password"
                  placeholder="Current Password"
                  variant="outlined"
                  onChange={(event) => setCurrPassword(event.target.value)}
                />
                <br />
                <TextField
                  label="New Password"
                  name="new-password"
                  type="password"
                  placeholder="New Password"
                  variant="outlined"
                  onChange={(event) => setNewPassword(event.target.value)}
                />
                <br />
                <Button
                  className="btn-green"
                  sx={{ color: "white" }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} style={{ color: "#FFFFFF" }} />
                  ) : (
                    "Update"
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
