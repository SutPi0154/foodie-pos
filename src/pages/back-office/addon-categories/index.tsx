import ItemCard from "@/components/ItemCard";
import NewAddonCategory from "@/components/NewAddonCategory";
import { useAppSelector } from "@/store/hooks";
import ClassIcon from "@mui/icons-material/Class";
import { Box, Button } from "@mui/material";

import { useState } from "react";
const AddonCategoriesPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const addonCategories = useAppSelector((store) => store.addonCategory.items);
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
          New Addon category
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {addonCategories.map((item) => (
          <ItemCard
            title={item.name}
            icon={<ClassIcon />}
            href={`/back-office/addon-categories/${item.id}`}
            key={item.id}
          />
        ))}
      </Box>
      <NewAddonCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonCategoriesPage;
