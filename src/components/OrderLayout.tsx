import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Props {
  children: string | JSX.Element | JSX.Element[];
  isDarkMode: boolean;
  setDarkMode: () => void;
}

const OrderLayout = ({ isDarkMode, setDarkMode, children }: Props) => {
  const router = useRouter();
  const companyId = router.query;
  const dispatch = useAppDispatch();
  const items = useAppSelector((store) => store.menuCategory.items);
  const isHome = router.pathname === `/order`;

  useEffect(() => {
    if (companyId) {
      dispatch(fetchAppData({}));
    }
  }, [companyId, dispatch]);

  return <Box>{children}</Box>;
};

export default OrderLayout;
