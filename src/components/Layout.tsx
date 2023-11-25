import { Box } from "@mui/material";
import { useRouter } from "next/router";
import BackOfficeLayout from "./BackOfficeLayout";
import OrderLayout from "./OrderLayout";
interface Props {
  children: string | JSX.Element | JSX.Element[];
  isDarkMode: boolean;
  setDarkMode: () => void;
}
const Layout = ({ children, isDarkMode, setDarkMode }: Props) => {
  const router = useRouter();
  const { tableId } = router.query;
  const isOrderApp = tableId;
  console.log(tableId);
  const isBackOfficeApp = router.pathname.includes("/back-office");
  if (isOrderApp) {
    return (
      <Box>
        <OrderLayout isDarkMode={isDarkMode} setDarkMode={setDarkMode}>
          {children}
        </OrderLayout>
      </Box>
    );
  }

  if (isBackOfficeApp) {
    return (
      <Box>
        <BackOfficeLayout isDarkMode={isDarkMode} setDarkMode={setDarkMode}>
          {children}
        </BackOfficeLayout>
      </Box>
    );
  }
  return <Box>{children}</Box>;
};

export default Layout;
