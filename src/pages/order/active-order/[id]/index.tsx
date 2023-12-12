import OrderCard from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshOrderThunk } from "@/store/slices/orderSlice";
import { OrderItem } from "@/types/order";
import { formatOrder } from "@/utils/general";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ActiveOrder = () => {
  const router = useRouter();
  const orderSeq = router.query.id as string;
  const orders = useAppSelector((store) => store.order.items);
  const addons = useAppSelector((store) => store.addon.items);
  const menus = useAppSelector((store) => store.menu.items);
  const tables = useAppSelector((store) => store.table.items);
  const orderItems: OrderItem[] = formatOrder(orders, addons, menus, tables);
  const dispatch = useAppDispatch();
  useEffect(() => {
    let intervalId: number;
    if (orders.length) {
      intervalId = window.setInterval(() => {
        dispatch(refreshOrderThunk({ orderSeq }));
      }, 5000);
    }
    return () => {
      window.clearInterval(intervalId);
    };
  }, [orders, dispatch, orderSeq]);
  if (!orders.length) return null;
  return (
    <Box
      sx={{
        top: { xs: 30, sm: 150 },
        position: "relative",
        zIndex: 5,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 3,
          bgcolor: "info.main",
          mx: 4,
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography color={"primary"} sx={{ fontStyle: "italic" }}>
          {orderSeq}
        </Typography>
        <Typography color={"primary"} sx={{ fontStyle: "italic" }}>
          Total price : {orders[0].totalPrice}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 4,
          justifyContent: "center",
        }}
      >
        {orderItems.map((orderItem) => {
          return (
            <OrderCard
              key={orderItem.itemId}
              orderItem={orderItem}
              isAdmin={false}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveOrder;
