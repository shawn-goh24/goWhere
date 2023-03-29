import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import MenuIcon from "@mui/icons-material/Menu";
import { auth } from "../firebase";

export default function NavBar(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { handleLogin, handleSignup, user, handleLogout, isPlanner } = props;

  // Check if current screen size is xs
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const settings = [
    <Link
      to={user ? `/user/${user.displayName}` : ""}
      style={{
        textDecoration: "none",
        color: "black",
        width: "100%",
        height: "35px",
        display: "flex",
        gap: "10px",
        marginLeft: "-1px",
        alignItems: "center",
        padding: "0 15px",
      }}
    >
      <PersonIcon /> <Typography>Profile</Typography>
    </Link>,
    <div
      style={{
        display: "flex",
        gap: "10px",
        width: "100%",
        height: "35px",
        alignItems: "center",
        padding: "0 15px",
      }}
      onClick={handleLogout}
    >
      <LogoutIcon /> <Typography>Log out</Typography>
    </div>,
  ];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  console.log(props.currentLocation);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "none" }}
        >
          <Container maxWidth="lg">
            <Toolbar>
              {props.isSmallScreen &&
              props.currentLocation.includes("planner") ? (
                <IconButton
                  onClick={() => props.handleSideOpen()}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon sx={{ color: "#53735E" }} />
                </IconButton>
              ) : null}
              <Typography
                component="div"
                sx={{ flexGrow: 1, fontSize: { xs: "1.5rem", sm: "1.8rem" } }}
                style={{
                  fontFamily: "Ribeye Marrow, cursive",
                  color: "#53735E",
                }}
              >
                <Link
                  to="/"
                  style={{ textDecoration: "none", color: "#53735E" }}
                >
                  goWhere
                </Link>
              </Typography>
              {user ? (
                <IconButton onClick={(e) => handleOpenUserMenu(e)}>
                  <Avatar alt="User Photo" src={user.photoURL} />
                </IconButton>
              ) : (
                <>
                  <Button
                    name="login"
                    variant="text"
                    sx={{ color: "#000000", mr: 1 }}
                    size={isSmallScreen ? "medium" : "large"}
                    className="btn-text"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button
                    name="signup"
                    variant="contained"
                    size={isSmallScreen ? "small" : "medium"}
                    className="btn-green"
                    onClick={handleSignup}
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
                  sx={{ padding: "0", minWidth: "150px" }}
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
