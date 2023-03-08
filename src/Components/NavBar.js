import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { auth } from "../firebase";

// const settings = [
//   <div
//     style={{
//       display: "flex",
//       gap: "10px",
//       marginLeft: "-1px",
//     }}
//   >
//     <PersonIcon /> <Typography>Profile</Typography>
//   </div>,
//   <div
//     style={{
//       display: "flex",
//       gap: "10px",
//     }}
//   >
//     <LogoutIcon /> <Typography>Log out</Typography>
//   </div>,
// ];

export default function NavBar(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { handleDialog, user, handleLogout } = props;

  // Check if current screen size is xs
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const settings = [
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginLeft: "-1px",
      }}
    >
      <PersonIcon /> <Typography>Profile</Typography>
    </div>,
    <div
      style={{
        display: "flex",
        gap: "10px",
      }}
    >
      <LogoutIcon /> <Typography onClick={handleLogout}>Log out</Typography>
    </div>,
  ];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "none" }}
        >
          <Container maxWidth="lg">
            <Toolbar>
              <Typography
                component="div"
                sx={{ flexGrow: 1, fontSize: { xs: "1.5rem", sm: "1.8rem" } }}
                style={{
                  fontFamily: "Ribeye Marrow, cursive",
                  color: "#53735E",
                }}
              >
                goWhere
              </Typography>
              {user ? (
                <IconButton onClick={(e) => handleOpenUserMenu(e)}>
                  <Avatar alt="User Photo" />
                </IconButton>
              ) : (
                <>
                  <Button
                    name="login"
                    variant="text"
                    sx={{ color: "#000000", mr: 1 }}
                    size={isSmallScreen ? "medium" : "large"}
                    className="btn-text"
                    onClick={handleDialog}
                  >
                    Login
                  </Button>
                  <Button
                    name="signup"
                    variant="contained"
                    size={isSmallScreen ? "small" : "medium"}
                    className="btn-green"
                    onClick={handleDialog}
                  >
                    Signup
                  </Button>
                </>
              )}
            </Toolbar>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem
                  key={index}
                  onClick={handleCloseUserMenu}
                  sx={{ padding: "0 15px", minWidth: "150px" }}
                >
                  {setting}
                </MenuItem>
              ))}
            </Menu>
          </Container>
        </AppBar>
      </Box>
    </>
  );
}
