import ItemCard from "@/components/ItemCard";
import NewMenu from "@/components/NewMenu";
import { useAppSelector } from "@/store/hooks";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const MenusPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menus = useAppSelector((store) => store.menus.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          New Menu
        </Button>
      </Box>
      <Box sx={{ display: "flex" }}>
        {menus.map((item) => (
          <ItemCard
            icon={<RestaurantMenuIcon />}
            href={`/back-office/menus/${item.id}`}
            title={item.name}
            key={item.id}
          />
        ))}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};
export default MenusPage;
