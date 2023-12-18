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
  const isBackOfficeApp = router.pathname.includes("/back-office");
  if (isOrderApp) {
    return <OrderLayout isDarkMode={isDarkMode}>{children}</OrderLayout>;
  }

  if (isBackOfficeApp) {
    return (
      <BackOfficeLayout isDarkMode={isDarkMode} setDarkMode={setDarkMode}>
        {children}
      </BackOfficeLayout>
    );
  }
  return <Box>{children}</Box>;
};

export default Layout;
