import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  Divider,
  DialogTitle,
  Box,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";

import { setErrorMessage } from "../../utils";

import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { isOpen, handleDialog, handleLoginDialog } = props;

  const handleClose = () => {
    handleLoginDialog();
    setErrorMsg();
    setLoading(false);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        setErrorMsg("");
        setLoading(false);
        handleLoginDialog();
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = setErrorMessage(error.code);
        setErrorMsg(errorMsg);
        setLoading(false);
      });
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
          <IconButton name="login" onClick={handleClose}>
            <CloseIcon name="login" sx={{ color: "#CCCCCC" }} />
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
            Hola!
          </DialogTitle>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            rowSpacing={3}
            sx={{ p: "24px 24px 10px 24px" }}
          >
            <Grid item xs={12}>
              <form
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={handleLogin}
              >
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
                    "Login"
                  )}
                </Button>
                {errorMsg === "" ? null : (
                  <Typography
                    sx={{ color: "maroon", textAlign: "center", mt: 2 }}
                  >
                    {errorMsg}
                  </Typography>
                )}
              </form>
            </Grid>
            <Grid item>
              <Divider flexItem sx={{ marginBottom: "15px" }} />
              <Typography variant="subtitle">
                Don't have an account?{" "}
                <a
                  onClick={handleDialog}
                  style={{
                    color: "#77a690",
                    cursor: "pointer",
                  }}
                >
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
