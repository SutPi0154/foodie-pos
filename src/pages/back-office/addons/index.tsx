import NewAddon from "@/components/NewAddon";
import { useAppSelector } from "@/store/hooks";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const AddonsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const addons = useAppSelector((store) => store.addons.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {addons.map((item) => (
          <Typography key={item.id}>{item.name}</Typography>
        ))}
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          New Addon
        </Button>
      </Box>
      <NewAddon open={open} setOpen={setOpen} />
    </Box>
  );
};
export default AddonsPage;
