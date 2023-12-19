import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { init } = useAppSelector((store) => store.app);

  useEffect(() => {
    if (session && init) {
      dispatch(fetchAppData({}));
    }
    if (!session) {
      router.push("/back-office");
    }
  }, [session, dispatch, router, init]);

  return (
    <Box sx={{ height: "100%" }}>
      <NavBar isDarkMode={isDarkMode} setDarkMode={setDarkMode} />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {session && (
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "block" },
              bgcolor: "success.main",
            }}
          >
            <SideBar />
          </Box>
        )}

        <Box sx={{ width: "100%", m: { xs: 2, md: 4 } }}> {children}</Box>
      </Box>
    </Box>
  );
};

export default BackOfficeLayout;
