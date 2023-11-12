import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddonThunk } from "@/store/slices/addonSlice";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { CreateAddonOptions } from "@/types/addon";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { AddonCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const defaultNewAddon = {
  name: "",
  price: 0,
  addonCategoryId: undefined,
};
const NewAddon = ({ open, setOpen }: Props) => {
  const [newAddon, setNewAddon] = useState<CreateAddonOptions>(defaultNewAddon);
  const addonCategories = useAppSelector((store) => store.addonCategory.items);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleChange = (e: SelectChangeEvent<number>) => {
    const selectId = e.target.value as number;
    setNewAddon({ ...newAddon, addonCategoryId: selectId });
  };
  const handleCreateAddon = () => {
    dispatch(
      createAddonThunk({
        ...newAddon,
        onSuccess: () => {
          setOpen(false);
          dispatch(toggleSnackbar({ message: "Created addon successfully" }));
        },
      })
    );
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewAddon(defaultNewAddon);
      }}
    >
      <DialogTitle>Create new Addon </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="name"
          type="text"
          sx={{ mt: 2 }}
          onChange={(e) => {
            setNewAddon({ ...newAddon, name: e.target.value });
          }}
        />
        <TextField
          label="price"
          type="number"
          onChange={(e) => {
            setNewAddon({ ...newAddon, price: Number(e.target.value) });
          }}
        />
        <FormControl fullWidth sx={{}}>
          <InputLabel>addon Category</InputLabel>
          <Select
            value={newAddon.addonCategoryId}
            label="addon Category"
            onChange={handleChange}
            sx={{ width: 400 }}
            renderValue={(selectedAddonCategoryId) => {
              return (
                addonCategories.find(
                  (item) => item.id === selectedAddonCategoryId
                ) as AddonCategory
              ).name;
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {addonCategories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setOpen(false);
            }}
            sx={{}}
          >
            cancel
          </Button>
          <Button
            disabled={!newAddon.addonCategoryId || !newAddon.name.trim()}
            variant="contained"
            onClick={handleCreateAddon}
          >
            confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddon;
