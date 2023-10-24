import NewOrder from "@/components/NewOrder";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const OrdersPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          New Order
        </Button>
      </Box>
      <NewOrder open={open} setOpen={setOpen} />
    </Box>
  );
};
export default OrdersPage;
