import MenuCard from "@/components/MenuCard";
import NewMenu from "@/components/NewMenu";
import { useAppSelector } from "@/store/hooks";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const MenusPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menus = useAppSelector((store) => store.menu.items);
  const disableLocationMenus = useAppSelector(
    (store) => store.disableLocationMenu.items
  );
  if (!menus) return null;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ mb: 4 }}
          onClick={() => {
            setOpen(true);
          }}
        >
          New Menu
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {menus.map((item) => {
          const isAvailable = disableLocationMenus.find(
            (disableLocationMenu) =>
              disableLocationMenu.locationId ===
                Number(localStorage.getItem("selectedLocationId")) &&
              disableLocationMenu.menuId === item.id
          )
            ? false
            : true;
          return (
            <MenuCard
              menu={item}
              href={`/back-office/menus/${item.id}`}
              isAvailable={isAvailable}
              key={item.id}
            />
          );
        })}
      </Box>
      <NewMenu open={open} setOpen={setOpen} />
    </Box>
  );
};
export default MenusPage;
