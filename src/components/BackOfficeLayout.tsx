import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

interface Props {
  children: string | JSX.Element | JSX.Element[];
  isDarkMode: boolean;
  setDarkMode: () => void;
}
const BackOfficeLayout = ({ children, isDarkMode, setDarkMode }: Props) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { init } = useAppSelector((store) => store.app);

  useEffect(() => {
    if (session) {
      dispatch(fetchAppData({}));
    }
  }, [session, dispatch]);

  return (
    <Box>
      <NavBar isDarkMode={isDarkMode} setDarkMode={setDarkMode} />
      <Box sx={{ color: "" }}></Box>
      <Box sx={{ display: "flex" }}>
        {session && <SideBar />}
        <Box sx={{ width: "100%", m: 4 }}> {children}</Box>
      </Box>
    </Box>
  );
};

export default BackOfficeLayout;
