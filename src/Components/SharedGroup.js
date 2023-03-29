import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import AddIcon from "@mui/icons-material/Add";
import { database } from "../firebase";
import { get, onValue, ref, runTransaction, set } from "firebase/database";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Modal,
  TextField,
  IconButton,
  Autocomplete,
  FormControl,
  FilledInput,
  Button,
  Tooltip,
  DialogActions,
  Link,
  Snackbar,
} from "@mui/material";
import { ReportGmailerrorred } from "@mui/icons-material";

const drawerWidth = 240;
const link = `${window.location.href}/shared`;

export default function SharedGroup(props) {
  const [input, setInput] = useState("");
  const [invited, setInvited] = useState([]);
  const [copied, setCopied] = useState("Copy link");
  const [shared, setShared] = useState([]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("invite");
  const [remove, setRemove] = useState([]);
  const [avatarGroup, setAvatarGroup] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);

  const { tripId, location, user } = props;

  useEffect(() => {
    const avatarRef = ref(database, `trips/${tripId}`);
    onValue(avatarRef, (data) => {
      const tmp = [data.val().creatorEmail.replace(".", "*")];
      if (data.val().members) {
        setShared([...tmp, ...Object.keys(data.val().members)]);
      } else {
        setShared([...tmp]);
      }
    });
  }, []);

  useEffect(() => {
    const avatarImgRef = ref(database, "users");
    get(avatarImgRef).then((data) => {
      const users = Object.values(data.val());

      const filterUser = users.filter((user) => {
        const tmp = user.email;
        const editedTmp = tmp.replace(".", "*");
        if (shared.includes(editedTmp)) {
          return user;
        }
      });

      const tmp2 = new Set();
      const tmp3 = new Set();

      shared.filter((user) => {
        const tmp = user;
        const editedTmp = tmp.replace("*", ".");
        for (let item of users) {
          if (item.email !== editedTmp) {
            tmp2.add(editedTmp);
          } else if (item.email === editedTmp) {
            tmp3.add(editedTmp);
          }
        }
      });

      const tmp4 = [];
      for (let i of tmp2) {
        if (!tmp3.has(i)) {
          console.log(i);
          tmp4.push(i);
        }
      }

      console.log(tmp4);

      setAvatarGroup([...filterUser, ...tmp4]);
    });
  }, [shared]);

  console.log(avatarGroup);

  const handleSubmit = (event) => {
    event.preventDefault();
    const tmp = [input];
    setInvited([...invited, ...tmp]);
    setInput("");
  };

  const emails = invited.map((email) => {
    const key = Math.random();
    return (
      <Box
        key={key}
        sx={{
          border: "1px solid black",
          p: "0px 5px",
          m: "2px",
          display: "flex",
          width: "fit-content",
          backgroundColor: "#f2f2f2",
          borderRadius: "20px",
          alignItems: "center",
        }}
      >
        <Typography>{email}</Typography>
        <IconButton onClick={() => removeEmail(email)}>
          <CloseIcon sx={{ width: "15px", height: "15px" }} />
        </IconButton>
      </Box>
    );
  });

  const removeEmail = (email) => {
    const tmp = invited;
    const index = tmp.indexOf(email);
    tmp.splice(index, 1);

    const tmp2 = [];

    setInvited([...tmp2, ...tmp]);
  };

  const members = shared.map((email) => {
    const tmp = email;
    const newEmail = tmp.replace("*", ".");
    return (
      <Box
        id={newEmail}
        key={newEmail}
        sx={{
          border: "1px solid black",
          p: "0px 5px",
          m: "2px",
          display: "flex",
          width: "fit-content",
          backgroundColor: "#f2f2f2",
          borderRadius: "20px",
          alignItems: "center",
        }}
      >
        <Typography>{newEmail}</Typography>
        <IconButton onClick={() => selectMember(newEmail)}>
          <CloseIcon sx={{ width: "15px", height: "15px" }} />
        </IconButton>
      </Box>
    );
  });

  const selectMember = (email) => {
    const currColor = document.getElementById(email).style.backgroundColor;
    console.log(document.getElementById(email).style.backgroundColor);
    console.log(currColor);
    document.getElementById(email).style.backgroundColor ===
      "rgb(242, 242, 242)" ||
    document.getElementById(email).style.backgroundColor === ""
      ? (document.getElementById(email).style.backgroundColor =
          "rgb(83, 115, 94)")
      : (document.getElementById(email).style.backgroundColor =
          "rgb(242, 242, 242)");

    if (!remove.includes(email)) {
      const tmp = [email];
      setRemove([...remove, ...tmp]);
    } else {
      const tmp2 = remove;
      const index = tmp2.indexOf(email);
      tmp2.splice(index, 1);
      const tmp3 = [];
      setRemove([...tmp3, ...tmp2]);
    }
  };

  const removeMember = () => {
    const shareRef = ref(database, `trips/${tripId}`);
    runTransaction(shareRef, (data) => {
      console.log(data);
      for (let i = 0; i < remove.length; i++) {
        const tmp = remove[i];
        const ans = tmp.replace(".", "*");
        if (data) {
          if (data.members && data.members[ans]) {
            data.members[ans] = null;
          } else {
            continue;
          }
        }
      }
      return data;
    });

    setRemove([]);
    setOpen(!open);
    setState("invite");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied("Copied");
  };

  const sendInvite = () => {
    const shareRef = ref(database, `trips/${tripId}`);
    // store members into trips db
    runTransaction(shareRef, (data) => {
      console.log(data);
      for (let i = 0; i < invited.length; i++) {
        const tmp = invited[i];
        const ans = tmp.replace(".", "*");
        if (data) {
          if (data.members && data.members[ans]) {
            continue;
          } else {
            if (!data.members) {
              data.members = {};
            }
            data.members[ans] = true;
          }
        }
      }
      return data;
    });

    // store shared trips in user db
    const userRef = ref(database, `users`);
    get(userRef)
      .then((data) => {
        // console.log(Object.values(data.val()));
        const users = Object.values(data.val());

        console.log(users);
        for (let i = 0; i < invited.length; i++) {
          for (let j = 0; j < users.length; j++) {
            const tmp = invited[i];
            const email = tmp.replace("*", ".");
            if (email === users[j].email) {
              console.log(email);
              console.log(users[j].userId);
              const userShareRef = ref(database, `users/${users[j].userId}`);
              runTransaction(userShareRef, (user) => {
                if (user) {
                  console.log(user);
                  if (user.sharedTrips && user.sharedTrips[tripId]) {
                    console.log("user exist in trips");
                  } else {
                    if (!user.sharedTrips) {
                      user.sharedTrips = {};
                    }
                    user.sharedTrips[tripId] = true;
                  }
                }
                return user;
              });
              break;
            }
          }
        }
      })
      .catch((error) => console.log(error));

    // send email to users
    const emailParams = {
      // location: location,
      invited_email: invited,
      from_user: user.displayName,
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICEID,
        process.env.REACT_APP_EMAILJS_TEMPLATEID,
        emailParams,
        process.env.REACT_APP_EMAILJS_PUBLICKEY
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          setSnackOpen(true);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );

    setInvited([]);
    setOpen(!open);
  };

  const avatars = avatarGroup.map((user) => {
    return (
      <Avatar
        key={user.email ? user.email : user}
        alt={user.email ? user.email : user}
        src={user.avatarUrl ? user.avatarUrl : ""}
      />
    );
  });

  const tooltip = shared.map((user) => {
    const tmpUser = user.replace("*", ".");
    return (
      <div key={tmpUser}>
        {tmpUser}
        <br />
      </div>
    );
  });

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 2, py: 2 }}>
      <Tooltip title={tooltip} arrow>
        <AvatarGroup max={4}>{avatars}</AvatarGroup>
      </Tooltip>
      <Avatar onClick={() => setOpen(!open)}>
        <AddIcon />
      </Avatar>
      <Dialog open={open} maxWidth="xs">
        {state === "invite" ? (
          <>
            <DialogTitle
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography sx={{ fontSize: "28px" }}>Invite friends</Typography>
              <IconButton
                onClick={() => {
                  setOpen(!open);
                  setCopied("copy link");
                  setState("invite");
                }}
              >
                <CloseIcon sx={{ color: "#CCCCCC" }} />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box mb={2}>
                <TextField size="small" disabled value={link} />
                <Button
                  className="btn-green"
                  sx={{ color: "white", ml: 1 }}
                  onClick={copy}
                >
                  {copied}
                </Button>
              </Box>
              <Box component="form" onSubmit={handleSubmit} width="100%">
                <TextField
                  fullWidth
                  required
                  value={input}
                  label="Invite by email"
                  size="small"
                  type="email"
                  onChange={(e) => setInput(e.target.value)}
                />
              </Box>
              {invited.length !== 0 ? (
                <>
                  <Box sx={{ display: "flex", flexWrap: "wrap", my: 1 }}>
                    {emails}
                  </Box>
                  {/* <TextField multiline rows={6} fullWidth /> */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      className="btn-green"
                      onClick={() => sendInvite()}
                      sx={{ color: "white" }}
                    >
                      Send invite
                    </Button>
                  </Box>
                </>
              ) : (
                ""
              )}
              <br />
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <Link
                sx={{ cursor: "pointer", color: "#77a690" }}
                underline="hover"
                onClick={() => setState("manage members")}
              >
                Manage trip members
              </Link>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box sx={{ display: "flex" }}>
                <IconButton onClick={() => setState("invite")}>
                  <ArrowBackIosIcon />
                </IconButton>
                <Typography sx={{ fontSize: "28px" }}>
                  Manage trip members
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  setOpen(!open);
                  setCopied("copy link");
                  setState("invite");
                }}
              >
                <CloseIcon sx={{ color: "#CCCCCC" }} />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>{members}</Box>
            </DialogContent>
            <DialogActions>
              <Button
                className="btn-green"
                sx={{ color: "white" }}
                onClick={() => removeMember()}
              >
                Remove member
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        message="Invitation Sent"
        action={action}
      />
    </Box>
  );
}
