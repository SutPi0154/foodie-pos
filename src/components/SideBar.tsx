import { useAppDispatch } from "@/store/hooks";
import { setCloseDrawer } from "@/store/slices/openDrawerSlice";
import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import EggIcon from "@mui/icons-material/Egg";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import TableBarIcon from "@mui/icons-material/TableBar";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

const SideBar = () => {
  const dispatch = useAppDispatch();
  return (
    <Box
      sx={{
        width: { lg: 350 },
        bgcolor: "success.main",
        minHeight: "100vh",

        borderTopRightRadius: 20,
      }}
    >
      <List>
        {sideBarItems.slice(0, 7).map((item) => (
          <Link
            key={item.id}
            style={{ textDecoration: "none" }}
            href={item.route}
            onClick={() => {
              dispatch(setCloseDrawer());
            }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "textSecondary.main" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ color: "textSecondary.main" }}
                ></ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider variant="middle" sx={{ bgcolor: "secondary.main" }} />
      <List>
        {sideBarItems.slice(-1).map((item) => (
          <Link
            key={item.id}
            onClick={() => {
              dispatch(setCloseDrawer());
            }}
            href={item.route}
            style={{ textDecoration: "none" }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "textSecondary.main" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  sx={{ color: "textSecondary.main" }}
                  primary={item.label}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default SideBar;
interface SidebarItemsType {
  id: number;
  label: string;
  icon: JSX.Element;
  route: string;
}

export const sideBarItems: SidebarItemsType[] = [
  {
    id: 1,
    label: "Orders",
    icon: <LocalMallIcon />,
    route: "/back-office/orders",
  },
  {
    id: 3,
    label: "Menus categories",
    icon: <CategoryIcon />,
    route: "/back-office/menu-categories",
  },
  {
    id: 2,
    label: "Menus",
    icon: <LocalDiningIcon />,
    route: "/back-office/menus",
  },
  {
    id: 5,
    label: "Addon categories",
    icon: <ClassIcon />,
    route: "/back-office/addon-categories",
  },
  {
    id: 4,
    label: "Addons",
    icon: <EggIcon />,
    route: "/back-office/addons",
  },
  {
    id: 6,
    label: "Tables",
    icon: <TableBarIcon />,
    route: "/back-office/tables",
  },
  {
    id: 7,
    label: "Locations",
    icon: <LocationOnIcon />,
    route: "/back-office/locations",
  },
  {
    id: 8,
    label: "Settings",
    icon: <SettingsIcon />,
    route: "/back-office/settings",
  },
];
