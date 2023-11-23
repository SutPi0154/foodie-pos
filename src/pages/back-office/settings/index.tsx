// import { useAppSelector } from "@/store/hooks";
// import {
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   SelectChangeEvent,
// } from "@mui/material";
// import { Location } from "@prisma/client";
// import { useEffect, useState } from "react";

// const SettingsPage = () => {
//   const [selectedLocationId, setSelectedLocationId] = useState("");
//   const locations: Location[] = useAppSelector(
//     (store: any) => store.location.items
//   );

//   const handleChangeLocation = (e: SelectChangeEvent<number>) => {
//     const id = String(e.target.value);
//     localStorage.setItem("selectedLocationId", id);
//     setSelectedLocationId(id);
//   };
//   useEffect(() => {
//     if (locations.length) {
//       const id = localStorage.getItem("selectedLocationId");
//       if (id) {
//         setSelectedLocationId(id);
//       }
//     } else {
//       const firstLocationId = String(locations[0].id);
//       setSelectedLocationId(firstLocationId);
//       localStorage.setItem("selectedLocationId", firstLocationId);
//     }
//   }, [locations]);
//   if (!selectedLocationId) return null;
//   return (
//     <FormControl sx={{ width: 400 }}>
//       <InputLabel>Location</InputLabel>
//       <Select
//         value={Number(selectedLocationId)}
//         label="Location"
//         onChange={handleChangeLocation}
//       >
//         {locations.map((item) => (
//           <MenuItem key={item.id} value={item.id}>
//             {item.name}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// };

// export default SettingsPage;
import { useAppSelector } from "@/store/hooks";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const locations = useAppSelector((state) => state.location.items);
  const [locationId, setLocationId] = useState<number>();

  useEffect(() => {
    if (locations.length) {
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (selectedLocationId) {
        setLocationId(Number(selectedLocationId));
      } else {
        const firstLocationId = locations[0].id;
        setLocationId(Number(firstLocationId));
        localStorage.setItem("selectedLocationId", String(firstLocationId));
      }
    }
  }, [locations]);

  const handleLocationChange = (evt: SelectChangeEvent<number>) => {
    localStorage.setItem("selectedLocationId", String(evt.target.value));
    setLocationId(Number(evt.target.value));
  };

  if (!locationId) return null;

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>Location</InputLabel>
        <Select
          value={locationId}
          label="Location"
          onChange={handleLocationChange}
        >
          {locations.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SettingsPage;
