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
import { onValue, ref, set } from "firebase/database";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

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
} from "@mui/material";

const drawerWidth = 240;
const link = `${window.location.href}/shared`;

export default function SharedGroup(props) {
  const [input, setInput] = useState("");
  const [invited, setInvited] = useState([]);
  const [copied, setCopied] = useState("Copy link");

  const [shared, setShared] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(true);
  const [placement, setPlacement] = useState();

  const { tripId } = props;

  // useEffect(() => {
  //   const avatarRef = ref(database, `trips/${tripId}`);
  //   onValue(avatarRef, (data) => {
  //     const tmp = [data.val().creatorId];
  //     setShared([...tmp, ...Object.keys(data.val().sharedWith)]);
  //   });

  //   const userAvatarRef = ref(database, "users");
  //   onValue(userAvatarRef, (url) => {
  //     console.log(Object.values(url.val()));
  //   });
  // }, []);

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

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied("Copied");
  };

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
          <AvatarGroup max={4}>
            {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" /> */}
          </AvatarGroup>
          <Avatar onClick={() => setOpen(!open)}>
            <AddIcon />
          </Avatar>
          <Dialog open={open} maxWidth="xs">
            <DialogTitle sx={{ display: "flex" }}>
              <Typography>Invite friends</Typography>
              <IconButton
                onClick={() => {
                  setOpen(!open);
                  setCopied("copy link");
                }}
              >
                <CloseIcon sx={{ color: "#CCCCCC" }} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box mb={2}>
                <TextField size="small" disabled value={link} />
                <Button onClick={copy}>{copied}</Button>
              </Box>
              <Box component="form" onSubmit={handleSubmit} width="100%">
                {/* <FormControl variant="filled">
                  <FilledInput
                    required
                    id="component-filled"
                    type="email"
                    TextField
                    size="small"
                    onChange={(e) => setValue(e.target.value)}
                  />
                </FormControl> */}
                <TextField
                  required
                  value={input}
                  label="Invite by email"
                  size="small"
                  type="email"
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit">Add</Button>
              </Box>
              {invited.length !== 0 ? (
                <>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>{emails}</Box>
                  <TextField multiline rows={6} fullWidth />
                  <Button onClick={() => console.log("send invite")}>
                    Send invite
                  </Button>
                </>
              ) : (
                ""
              )}
              <br />
              <Divider />
              <Box>Manage trip members</Box>
            </DialogContent>
          </Dialog>
        </Box>
      </Drawer>
    </>
  );
}
