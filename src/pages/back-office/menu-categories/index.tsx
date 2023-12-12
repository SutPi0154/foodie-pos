import ItemCard from "@/components/ItemCard";
import NewMenuCategory from "@/components/NewMenuCategory";
import { useAppSelector } from "@/store/hooks";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const MenuCategoriesPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const disableLocationMenuCategories = useAppSelector(
    (store) => store.disableLocationMenuCategory.items
  );
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          New Menu category
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          mt: 4,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {menuCategories.map((item) => {
          const isAvailable = disableLocationMenuCategories.find(
            (disableLocationMenuCategory) =>
              disableLocationMenuCategory.locationId ===
                Number(localStorage.getItem("selectedLocationId")) &&
              disableLocationMenuCategory.menuCategoryId === item.id
          )
            ? false
            : true;
          return (
            <ItemCard
              key={item.id}
              title={item.name}
              icon={<CategoryIcon />}
              href={`/back-office/menu-categories/${item.id}`}
              isAvailable={isAvailable}
            ></ItemCard>
          );
        })}
      </Box>
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
};
export default MenuCategoriesPage;
