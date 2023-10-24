import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

const pages = ["Products", "Pricing", "Blog"];

interface ThemeToggleProps {
  isDarkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}
const NavBar: React.FC<ThemeToggleProps> = ({ isDarkMode, setDarkMode }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { data: session } = useSession();

  const handleThemeToggle = () => {
    setDarkMode(!isDarkMode);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "success.main",
      }}
    >
      <Toolbar
        sx={{
          w: "screen",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mx: 10,
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          LOGO
        </Typography>
        <Typography
          variant="h5"
          color={"secondary"}
          sx={{
            textDecoration: "none",
          }}
        >
          Foodie POS
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {session ? (
                  <Avatar src={session.user?.image} />
                ) : (
                  <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJIyiiNbz3VC9Afr-LqWpcw7loxjPnacfZSA&usqp=CAU" />
                )}
              </IconButton>
            </Tooltip>
            {session ? (
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
                <MenuItem
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  <Typography textAlign="center">Sign out</Typography>
                </MenuItem>
              </Menu>
            ) : (
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
                <MenuItem
                  onClick={() => {
                    signIn("google");
                  }}
                >
                  <Typography textAlign="center">Sign In</Typography>
                </MenuItem>
              </Menu>
            )}
          </Box>
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
