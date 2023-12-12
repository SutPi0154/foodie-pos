import OrderCard from "@/components/OrderCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOrderThunk } from "@/store/slices/orderSlice";
import { OrderItem } from "@/types/order";
import { formatOrder } from "@/utils/general";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const orders = useAppSelector((store) => store.order.items);
  const addons = useAppSelector((store) => store.addon.items);
  const menus = useAppSelector((store) => store.menu.items);
  const tables = useAppSelector((store) => store.table.items);
  const [value, setValue] = useState<ORDERSTATUS>(ORDERSTATUS.PENDING);
  const [filteredOrders, setFilterOrders] = useState<OrderItem[]>([]);
  useEffect(() => {
    const formattedOrder = formatOrder(orders, addons, menus, tables).filter(
      (orderItem) => orderItem.status === value
    );
    setFilterOrders(formattedOrder);
  }, [value, orders, addons, menus, tables]);
  const dispatch = useAppDispatch();
  const handleOrderStatusUpdate = (itemId: string, status: ORDERSTATUS) => {
    dispatch(updateOrderThunk({ itemId, status }));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ToggleButtonGroup
          color="primary"
          value={value}
          exclusive
          onChange={(evt, value) => setValue(value as ORDERSTATUS)}
          aria-label="Platform"
        >
          <ToggleButton value={ORDERSTATUS.PENDING}>
            {ORDERSTATUS.PENDING}
          </ToggleButton>
          <ToggleButton value={ORDERSTATUS.COOKING}>
            {ORDERSTATUS.COOKING}
          </ToggleButton>
          <ToggleButton value={ORDERSTATUS.COMPLETE}>
            {ORDERSTATUS.COMPLETE}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {filteredOrders.map((orderItem) => {
          return (
            <OrderCard
              isAdmin
              orderItem={orderItem}
              handleOrderStatusUpdate={handleOrderStatusUpdate}
              key={orderItem.itemId}
            />
          );
        })}
      </Box>
    </Box>
  );
};
export default OrdersPage;
