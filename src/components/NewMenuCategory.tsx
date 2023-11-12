import { useAppDispatch } from "@/store/hooks";
import { createMenuCategory } from "@/store/slices/menuCategorySlice";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { CreateMenuCategoryOptions } from "@/types/menuCategory";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const defaultMenuCategory = {
  name: "",
  locationId: undefined,
};
const NewMenuCategory = ({ open, setOpen }: Props) => {
  const [newMenuCategory, setNewMenuCategory] =
    useState<CreateMenuCategoryOptions>(defaultMenuCategory);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNewMenuCategory((prevData) => ({
      ...prevData,
      locationId: Number(localStorage.getItem("selectedLocationId")),
    }));
  }, []);

  const handleCreateMenuCategory = () => {
    dispatch(
      createMenuCategory({
        ...newMenuCategory,
        onSuccess: () => {
          setOpen(false);
          dispatch(
            toggleSnackbar({ message: "Created menu category successfully" })
          );
        },
      })
    );
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new category</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="name"
            autoFocus
            sx={{ width: 400 }}
            variant="outlined"
            onChange={(e) => {
              setNewMenuCategory({ ...newMenuCategory, name: e.target.value });
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            mt: 2,
            justifyContent: "center",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Button
            sx={{}}
            color="info"
            onClick={() => {
              setOpen(false);
            }}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            sx={{}}
            // disabled={}
            onClick={handleCreateMenuCategory}
            variant="contained"
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenuCategory;
