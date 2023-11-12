import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteLocationThunk,
  updateLocationThunk,
} from "@/store/slices/locationSlice";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { UpdateLocationOptions } from "@/types/location";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LocationDetail = () => {
  const router = useRouter();
  const locationId = Number(router.query.id);
  const locations = useAppSelector((store: any) => store.location.items);
  const location = locations.find((item: any) => item.id === locationId);
  const [data, setData] = useState<UpdateLocationOptions>();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (location) {
      setData({
        id: location.id,
        name: location.name,
        companyId: location.companyId,
        address: location.address,
      });
    }
  }, [location]);

  if (!location || !data)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );

  const handleUpdateTable = () => {
    dispatch(
      updateLocationThunk({
        ...data,
        onSuccess: () => {
          dispatch(
            toggleSnackbar({ message: "Updated location successfully" })
          );
        },
      })
    );
  };
  const handleDeleteLocation = () => {
    dispatch(
      deleteLocationThunk({
        id: locationId,
        onSuccess: () => {
          setOpen(false);
          dispatch(
            toggleSnackbar({ message: "Deleted location successfully" })
          );
          router.push("/back-office/locations");
        },
      })
    );
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: 600,
      }}
    >
      <Box
        sx={{
          alignSelf: "flex-end",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          color="error"
          sx={{ width: "fit-content" }}
          onClick={() => {
            setOpen(true);
          }}
        >
          delete
        </Button>
      </Box>
      <TextField
        label="name"
        sx={{ width: 400 }}
        defaultValue={data.name}
        onChange={(e) => {
          setData({ ...data, id: location.id, name: e.target.value });
        }}
      />
      <TextField
        label="name"
        sx={{ width: 400 }}
        defaultValue={data.address}
        onChange={(e) => {
          setData({ ...data, id: location.id, address: e.target.value });
        }}
      />

      <Box
        sx={{ width: 400, display: "flex", justifyContent: "center", gap: 2 }}
      >
        <Button
          variant="contained"
          sx={{}}
          color="info"
          onClick={() => {
            router.push("/back-office/locations");
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleUpdateTable}>
          Update
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this location?
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
            }}
            color="info"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteLocation}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default LocationDetail;
