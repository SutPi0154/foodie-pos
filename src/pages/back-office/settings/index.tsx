import { useAppSelector } from "@/store/hooks";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const locations = useAppSelector((store) => store.location.items);

  const handleChangeLocation = (e: SelectChangeEvent<number>) => {
    const id = String(e.target.value);
    localStorage.setItem("selectedLocationId", id);
    setSelectedLocationId(id);
  };
  useEffect(() => {
    if (locations.length) {
      const id = localStorage.getItem("selectedLocationId");
      if (id) {
        setSelectedLocationId(id);
      }
    } else {
      const firstLocationId = String(locations[0].id);
      setSelectedLocationId(firstLocationId);
      localStorage.setItem("selectedLocationId", firstLocationId);
    }
  }, [locations]);
  if (!selectedLocationId) return null;
  return (
    <FormControl sx={{ width: 400 }}>
      <InputLabel>Location</InputLabel>
      <Select
        value={Number(selectedLocationId)}
        label="Location"
        onChange={handleChangeLocation}
      >
        {locations.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SettingsPage;
