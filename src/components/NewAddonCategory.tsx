import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAddonCategoryThunk } from "@/store/slices/addonCategorySlice";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { CreateAddonCategoryOptions } from "@/types/addonCategory";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Menu } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const defaultNewAddonCategory = {
  name: "",
  isRequired: true,
  menuIds: [],
};
const NewAddonCategory = ({ open, setOpen }: Props) => {
  const [newAddonCategory, setNewAddonCategory] =
    useState<CreateAddonCategoryOptions>(defaultNewAddonCategory);
  const dispatch = useAppDispatch();
  const menus = useAppSelector((store) => store.menu.items);
  const addonCategory = useAppSelector((store) => store.addonCategory.items);

  const handleCreateNewAddonCategory = () => {
    const isValid =
      newAddonCategory.name.trim() !== "" &&
      newAddonCategory.menuIds.length > 0;
    if (!isValid) return;
    dispatch(
      createAddonCategoryThunk({
        ...newAddonCategory,
        onSuccess: () => {
          setNewAddonCategory(defaultNewAddonCategory);
          setOpen(false);
          dispatch(toggleSnackbar({ message: "Created addon successfully" }));
        },
      })
    );
  };

  const handleChange = (e: SelectChangeEvent<number[]>) => {
    const selectedIds = e.target.value as number[];
    setNewAddonCategory({ ...newAddonCategory, menuIds: selectedIds });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewAddonCategory(defaultNewAddonCategory);
      }}
    >
      <DialogTitle>Create new Addon Category </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="name"
            sx={{
              width: 400,
              mt: 2,
            }}
            onChange={(e) => {
              setNewAddonCategory({
                ...newAddonCategory,
                name: e.target.value,
              });
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Menus</InputLabel>

            <Select
              label="Menus"
              sx={{ width: 400 }}
              multiple
              value={newAddonCategory.menuIds}
              onChange={handleChange}
              renderValue={(selectMenuIds) => {
                return selectMenuIds
                  .map((selectMenuId) => {
                    return menus.find(
                      (item) => item.id === selectMenuId
                    ) as Menu;
                  })
                  .map((item) => <Chip label={item.name} key={item.id}></Chip>);
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
              {menus.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <Checkbox
                    checked={newAddonCategory.menuIds.includes(item.id)}
                  />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox defaultChecked={newAddonCategory.isRequired} />}
            label="is required"
            onChange={(e, value) => {
              setNewAddonCategory({
                ...newAddonCategory,
                isRequired: value,
              });
            }}
          />

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
                setNewAddonCategory(defaultNewAddonCategory);
              }}
            >
              cancel
            </Button>
            <Button variant="contained" onClick={handleCreateNewAddonCategory}>
              confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddonCategory;
