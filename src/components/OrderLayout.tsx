import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OrderAppHeader from "./OrderAppHeader";

interface Props {
  children: string | JSX.Element | JSX.Element[];
}

const OrderLayout = (props: Props) => {
  const router = useRouter();
  const { tableId } = router.query;
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isHome = router.pathname === "/order";
  const isActiveOrderPage = router.pathname.includes("active-order");
  const orders = useAppSelector((state) => state.order.items);

  useEffect(() => {
    if (tableId) {
      dispatch(fetchAppData({ tableId: Number(tableId) }));
    }
  }, [tableId, dispatch]);

  return (
    <Box>
      <OrderAppHeader cartItemCount={cartItems.length} />
      <Box
        sx={{ position: "relative", top: isHome ? { xs: 150, md: 240 } : 0 }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "80%", lg: "55%" },
            m: "0 auto",
            mb: 10,
          }}
        >
          {props.children}
        </Box>
      </Box>
      {orders.length && !isActiveOrderPage && (
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
            zIndex: 6,
          }}
          onClick={() =>
            router.push({
              pathname: `/order/active-order/${orders[0].orderSeq}`,
              query: router.query,
            })
          }
        >
          <Typography
            sx={{
              color: "secondary.main",
              userSelect: "none",
              px: 1,
              textAlign: "center",
            }}
          >
            You have active order. Click here to view.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrderLayout;
