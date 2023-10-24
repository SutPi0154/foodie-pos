import NewMenuCategory from "@/components/NewMenuCategory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const MenuCategoriesPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menuCategories = useAppSelector((store) => store.menuCategories.items);
  console.log(menuCategories);
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
      {menuCategories.map((item) => (
        <Box key={item.id}>
          {" "}
          <Typography>{item.name}</Typography>
        </Box>
      ))}
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
};
export default MenuCategoriesPage;
