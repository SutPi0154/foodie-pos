// import ItemCard from "@/components/ItemCard";
// import NewLocation from "@/components/NewLocation";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { setSelectedLocation } from "@/store/slices/locationSlice";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import { Box, Button } from "@mui/material";
// import { useState } from "react";

// const LocationsPage = () => {
//   const [open, setOpen] = useState<boolean>(false);
//   const { items: locations, selectedLocation } = useAppSelector(
//     (store: any) => store.location
//   );
//   const dispatch = useAppDispatch();
//   return (
//     <Box>
//       <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//         <Button
//           variant="contained"
//           onClick={() => {
//             setOpen(true);
//           }}
//         >
//           New Location
//         </Button>
//       </Box>
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 5,
//           mt: 2,
//           justifyContent: { xs: "center", sm: "flex-start" },
//         }}
//       >
//         {locations.map((item: any) => (
//           <ItemCard
//             key={item.id}
//             title={item.name}
//             handleChangeSelectedLocation={() => {
//               dispatch(setSelectedLocation(item));
//               localStorage.setItem("selectedLocationId", String(item.id));
//             }}
//             selected={item.id === selectedLocation.id}
//             icon={<LocationOnIcon />}
//           ></ItemCard>
//         ))}
//       </Box>
//       <NewLocation open={open} setOpen={setOpen} />
//     </Box>
//   );
// };
// export default LocationsPage;
import ItemCard from "@/components/ItemCard";
import NewLocation from "@/components/NewLocation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedLocation } from "@/store/slices/locationSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const LocationsPage = () => {
  const [open, setOpen] = useState(false);
  const { items: locations, selectedLocation } = useAppSelector(
    (state) => state.location
  );
  const dispatch = useAppDispatch();
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New location
        </Button>
      </Box>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {locations.map((item) => (
          <Box
            key={item.id}
            onClick={() => {
              dispatch(setSelectedLocation(item));
              localStorage.setItem("selectedLocationId", String(item.id));
            }}
          >
            <ItemCard
              icon={<LocationOnIcon fontSize="large" />}
              title={item.name}
              selected={item.id === selectedLocation?.id}
            />
          </Box>
        ))}
      </Box>
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};

export default LocationsPage;
