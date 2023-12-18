import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewLocation } from "@/store/slices/locationSlice";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
interface NewLocation {
  name: string;
  address: string;
}
const defaultNewLocation = {
  name: "",
  street: "",
  city: "",
  township: "",
};
const NewLocation = ({ open, setOpen }: Props) => {
  const companyId = useAppSelector((store) => store.company.item?.id);
  const [newLocation, setNewLocation] = useState(defaultNewLocation);
  const dispatch = useAppDispatch();
  if (!companyId) return null;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",
          },
        },
      }}
    >
      <DialogTitle>Create new Location </DialogTitle>
      <DialogContent>
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="name"
              onChange={(e) => {
                setNewLocation({ ...newLocation, name: e.target.value });
              }}
            />
            <TextField
              label="street"
              onChange={(e) => {
                setNewLocation({ ...newLocation, street: e.target.value });
              }}
            />
            <TextField
              label="township"
              onChange={(e) => {
                setNewLocation({ ...newLocation, township: e.target.value });
              }}
            />
            <TextField
              label="city"
              onChange={(e) => {
                setNewLocation({ ...newLocation, city: e.target.value });
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                setOpen(false);
              }}
            >
              cancel
            </Button>
            <Button
              variant="contained"
              disabled={
                !newLocation.name.trim() ||
                !newLocation.street.trim() ||
                !newLocation.township.trim() ||
                !newLocation.city.trim()
              }
              onClick={() => {
                dispatch(
                  createNewLocation({
                    ...newLocation,
                    companyId,
                    onSuccess: () => {
                      setOpen(false);
                      setNewLocation(defaultNewLocation);
                      dispatch(
                        toggleSnackbar({
                          message: "Create new location successfully",
                        })
                      );
                    },
                  })
                );
              }}
            >
              confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewLocation;
