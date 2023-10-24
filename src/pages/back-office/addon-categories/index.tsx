import NewAddonCategory from "@/components/NewAddonCategory";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
const AddonCategoriesPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const addonCategories = useAppSelector(
    (store) => store.addonCategories.items
  );
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {addonCategories.map((item) => (
          <Typography key={item.id}>{item.name}</Typography>
        ))}
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          New Addon category
        </Button>
      </Box>
      <NewAddonCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonCategoriesPage;
