import ItemCard from "@/components/ItemCard";
import NewLocation from "@/components/NewLocation";
import { useAppSelector } from "@/store/hooks";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const LocationsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const locations = useAppSelector((store: any) => store.location.items);
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          New Location
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 5, mt: 2 }}>
        {locations.map((item: any) => (
          <ItemCard
            key={item.id}
            href={`/back-office/locations/${item.id}`}
            title={item.name}
            icon={<LocationOnIcon />}
          ></ItemCard>
        ))}
      </Box>
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};
export default LocationsPage;
