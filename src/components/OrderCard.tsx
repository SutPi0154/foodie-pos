import { useAppSelector } from "@/store/hooks";
import { OrderItem } from "@/types/order";
import { Box, Card, MenuItem, Select, Typography } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";

interface Props {
  orderItem: OrderItem;
  isAdmin: boolean;
  handleOrderStatusUpdate?: (itemId: string, state: ORDERSTATUS) => void;
}
const OrderCard = ({ orderItem, isAdmin, handleOrderStatusUpdate }: Props) => {
  const addonCategories = useAppSelector((store) => store.addonCategory.items);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",

        justifyContent: "space-between",
        width: 300,
        height: 300,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "primary.main",
          px: 2,
          py: 1 * 0.5,
        }}
      >
        <Typography sx={{ color: "textSecondary.main" }}>
          {orderItem.menu.name}
        </Typography>
        <Typography sx={{ color: "textSecondary.main" }}>
          {orderItem.table.name}
        </Typography>
      </Box>
      <Box
        sx={{
          height: 250 * 0.15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid lightgray",
          py: 1,
          px: 2,
          mr: 2,
        }}
      >
        <Typography>ItemId: </Typography>
        <Typography>{orderItem.itemId}</Typography>
      </Box>
      <Box
        sx={{
          height: 250 * 0.6,
          overflow: "hidden",
          overflowY: "scroll",
          py: 1,
          px: 2,
          mt: 2,
          mr: 2,
        }}
      >
        {orderItem.orderAddons.map((orderAddon) => {
          const addonCategory = addonCategories.find(
            (item) => item.id === orderAddon.addonCategoryId
          );
          return (
            <Box key={orderAddon.addonCategoryId} sx={{ mb: 2 }}>
              <Typography>{addonCategory?.name}</Typography>
              <Box>
                {orderAddon.addons.map((item) => {
                  return (
                    <Typography
                      key={item.id}
                      sx={{
                        ml: 2,
                        fontSize: 14,
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                    >
                      {item.name}
                    </Typography>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          height: 250 * 0.15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid lightgray",
          py: 1,
          px: 2,
          mt: 2,
          mb: 0.5,
          mr: 2,
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Status:</Typography>
        {isAdmin ? (
          <>
            <Select
              value={orderItem.status}
              onChange={(evt) =>
                handleOrderStatusUpdate &&
                handleOrderStatusUpdate(
                  orderItem.itemId,
                  evt.target.value as ORDERSTATUS
                )
              }
              sx={{ height: 30 }}
            >
              <MenuItem value={ORDERSTATUS.PENDING}>
                {ORDERSTATUS.PENDING}
              </MenuItem>
              <MenuItem value={ORDERSTATUS.COOKING}>
                {ORDERSTATUS.COOKING}
              </MenuItem>
              <MenuItem value={ORDERSTATUS.COMPLETE}>
                {ORDERSTATUS.COMPLETE}
              </MenuItem>
            </Select>
          </>
        ) : (
          <Typography>{orderItem.status}</Typography>
        )}
      </Box>
    </Card>
  );
};
export default OrderCard;
