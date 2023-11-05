import { useAppDispatch } from "@/store/hooks";
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
  address: "",
};
const NewLocation = ({ open, setOpen }: Props) => {
  const [newLocation, setNewLocation] = useState(defaultNewLocation);
  const dispatch = useAppDispatch();
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="name"
              onChange={(e) => {
                setNewLocation({ ...newLocation, name: e.target.value });
              }}
            />
            <TextField
              label="address"
              onChange={(e) => {
                setNewLocation({ ...newLocation, address: e.target.value });
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
              onClick={() => {
                setOpen(false);
              }}
            >
              cancel
            </Button>
            <Button
              variant="contained"
              disabled={newLocation.name && newLocation.address ? false : true}
              onClick={() => {
                dispatch(
                  createNewLocation({
                    ...newLocation,
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
