import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMenuCategory } from "@/store/slices/menuCategorySlice";
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
const NewMenuCategory = ({ open, setOpen }: Props) => {
  const menuCategories = useAppSelector((state) => state.menuCategories.items);
  const [name, setName] = useState<string>("");
  const onSuccess = () => {
    setOpen(false);
  };
  const dispatch = useAppDispatch();
  const handleCreateMenuCategory = () => {
    const selectedLocationId = localStorage.getItem("LocationId");
    dispatch(
      createMenuCategory({
        name: name,
        locationId: Number(selectedLocationId),
        onSuccess,
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
              setName(e.target.value);
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
            onClick={() => {
              setOpen(false);
            }}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            sx={{}}
            disabled={!name}
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
