import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, Typography } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  isDarkMode: boolean;
  setDarkMode: (isDarkMode: boolean) => void;
  children: string | JSX.Element | JSX.Element[];
}

const OrderLayout = ({ children, isDarkMode, setDarkMode }: Props) => {
  const router = useRouter();
  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isHome = router.pathname === "/order";
  const isActiveOrderPage = router.pathname.includes("active-order");
  const orders = useAppSelector((state) => state.order.items);
  const showActiveOrderFooterBar =
    !isActiveOrderPage &&
    orders.length &&
    orders.some(
      (item) =>
        item.status === ORDERSTATUS.COOKING ||
        item.status === ORDERSTATUS.PENDING
    );
  const { init } = useAppSelector((store) => store.app);

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId, dispatch]);

  return (
    <>
      <Box
        sx={{
          height: isHome ? 260 : 10,
        }}
      >
        <OrderAppHeader
          isDarkMode={isDarkMode}
          setDarkMode={setDarkMode}
          cartItemCount={cartItems.length}
        />
      </Box>
      <Box
        sx={{
          top: isHome ? { sm: 240 } : 0,
          mb: 10,
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "80%", lg: "55%", mb: 10 },
            m: "0 auto",
          }}
        >
          {children}
        </Box>
      </Box>
      {showActiveOrderFooterBar ? (
        <Box
          sx={{
            height: 50,
            width: "100vw",
            bgcolor: "primary.main",
            position: "fixed",
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            cursor: "pointer",
            zIndex: 5,
          }}
          onClick={() =>
            router.push({
              pathname: `/order/active-order/${orders[0].orderSeq}`,
              query: router.query,
            })
          }
        >
          <Typography sx={{ color: "secondary.main", userSelect: "none" }}>
            You have active order. Click here to view.
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default OrderLayout;
