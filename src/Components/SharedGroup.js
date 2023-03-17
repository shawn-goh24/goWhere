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
import { onValue, ref } from "firebase/database";

const drawerWidth = 240;

export default function SharedGroup(props) {
  const [shared, setShared] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);

  const { tripId } = props;

  useEffect(() => {
    const avatarRef = ref(database, `trips/${tripId}`);
    onValue(avatarRef, (data) => {
      const tmp = [data.val().creatorId];
      setShared([...tmp, ...Object.keys(data.val().sharedWith)]);
    });

    const userAvatarRef = ref(database, "users");
    onValue(userAvatarRef, (url) => {
      console.log(Object.values(url.val()));
    });
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

  // console.log(creator);
  // console.log(shared);

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
          <Avatar onClick={() => console.log("Invite user")}>
            <AddIcon />
          </Avatar>
        </Box>
      </Drawer>
    </>
  );
}
