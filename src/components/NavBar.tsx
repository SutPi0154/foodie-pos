import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCloseDrawer, setOpenDrawer } from "@/store/slices/openDrawerSlice";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import SideBar from "./SideBar";

interface ThemeToggleProps {
  isDarkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}
const NavBar: React.FC<ThemeToggleProps> = ({ isDarkMode, setDarkMode }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const locations = useAppSelector((store) => store.location.items);
  const { selectedLocation } = useAppSelector((store) => store.location);
  const { data: session } = useSession();
  const openDrawer = useAppSelector((store) => store.openDrawer.open);
  const dispatch = useAppDispatch();
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
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mx: { xs: 2, sm: 5, lg: 10 },
          my: 1,
        }}
      >
        <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
          <Image
            alt="logo"
            src={"/logo.png"}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "120px", height: "auto" }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" color={"secondary"}>
            Foodie Pos
          </Typography>
          <Typography color={"secondary"} sx={{ fontSize: 12 }}>
            ( {selectedLocation?.name})
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "start", sm: "start", md: "center" },
            alignItems: "center",
          }}
        >
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={() => {
                dispatch(setOpenDrawer());
              }}
              sx={{ display: { sm: "block", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {session ? (
                    <Avatar src={"/avatar.png"} />
                  ) : (
                    <Avatar src={"/avatar.png"} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            {session ? (
              <Box>
                <Menu
                  sx={{ mt: "45px", display: { xs: "none", sm: "block" } }}
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
                      signOut({ callbackUrl: "/back-office" });
                    }}
                  >
                    <Typography textAlign="center">Sign out</Typography>
                  </MenuItem>
                </Menu>
              </Box>
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
                    signIn("google", { callbackUrl: "/back-office" });
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
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => {
            dispatch(setCloseDrawer());
          }}
        >
          <SideBar />
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
