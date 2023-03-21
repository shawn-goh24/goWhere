import React, { useEffect, useState } from "react";
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
import { onValue, ref, runTransaction, set } from "firebase/database";
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
} from "@mui/material";

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

  const { tripId } = props;

  useEffect(() => {
    const avatarRef = ref(database, `trips/${tripId}`);
    onValue(avatarRef, (data) => {
      const tmp = [data.val().creatorName];
      if (data.val().members) {
        setShared([...tmp, ...Object.keys(data.val().members)]);
      } else {
        setShared([...tmp]);
      }
    });

    // const userAvatarRef = ref(database, "users");
    // onValue(userAvatarRef, (url) => {
    //   console.log(Object.values(url.val()));
    // });
  }, []);

  const drawer = (
    <Box>
      <Divider />
      <List>
        {["Interested Places", "Packing List", "Documents"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={getSelection}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
      <List>
        {["Itinerary"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={getSelection}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

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

    setInvited([]);
    setOpen(!open);
  };

  const avatars = shared.map((email) => {
    return <Avatar key={email} alt={email} />;
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

  // console.log(remove);

  // To get current link
  // console.log(window.location.href + "/shared");  // add share to those that want to view only

  return (
    <>
      <Drawer
        PaperProps={{
          style: {
            position: "relative",
          },
        }}
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "flex" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            justifyContent: "space-between",
            // backgroundColor: "yellow",
          },
          height: "calc(100vh - 64px)",
          flexDirection: "column",
        }}
        open
      >
        <Box>{drawer}</Box>

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
                  <Typography sx={{ fontSize: "28px" }}>
                    Invite friends
                  </Typography>
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
                <DialogActions
                  sx={{ display: "flex", justifyContent: "center" }}
                >
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
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {members}
                  </Box>
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
        </Box>
      </Drawer>
    </>
  );
}
