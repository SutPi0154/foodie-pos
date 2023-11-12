import ItemCard from "@/components/ItemCard";
import NewAddon from "@/components/NewAddon";
import { useAppSelector } from "@/store/hooks";
import EggIcon from "@mui/icons-material/Egg";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const AddonsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const addons = useAppSelector((store) => store.addon.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          New Addon
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {addons.map((item) => (
          <ItemCard
            title={item.name}
            href={`/back-office/addons/${item.id}`}
            icon={<EggIcon />}
            key={item.id}
          />
        ))}
      </Box>
      <NewAddon open={open} setOpen={setOpen} />
    </Box>
  );
};
export default AddonsPage;
