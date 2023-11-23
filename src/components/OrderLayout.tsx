import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  children: string | JSX.Element | JSX.Element[];
  isDarkMode: boolean;
  setDarkMode: () => void;
}

const OrderLayout = ({ isDarkMode, setDarkMode, children }: Props) => {
  const router = useRouter();
  const { companyId, tableId } = router.query;
  const dispatch = useAppDispatch();
  const items = useAppSelector((store) => store.menuCategory.items);
  const isHome = router.pathname === `/order`;

  useEffect(() => {
    if (companyId && tableId) {
      dispatch(
        fetchAppData({ companyId: Number(companyId), tableId: Number(tableId) })
      );
    }
  }, [companyId, tableId, dispatch]);
  return (
    <Box>
      <OrderAppHeader cartItemCount={1} />

      <Box sx={{ position: "relative", zIndex: 5, top: isHome ? 240 : 0 }}>
        <Box sx={{ width: { xs: "100%", md: "80%", lg: "55%" }, m: "0 auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderLayout;
