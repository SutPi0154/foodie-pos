import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMenuThunk } from "@/store/slices/menuSlices";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { CreateNewMenuOption } from "@/types/menu";
import { config } from "@/utils/config";
import {
  Box,
  Button,
  Checkbox,
  Chip,
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
import { MenuCategory } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import FileDropZone from "./FileDropZone";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const defaultNewMenu: CreateNewMenuOption = {
  name: "",
  price: 0,
  menuCategoryIds: [],
};
const NewMenu = ({ open, setOpen }: Props) => {
  const menuCategories = useAppSelector((state) => state.menuCategory.items);

  const [newMenu, setNewMenu] = useState(defaultNewMenu);
  const [menuImage, setMenuImage] = useState<File>();
  const handleChange = (e: SelectChangeEvent<number[]>) => {
    const selectedIds = e.target.value as number[];
    setNewMenu({ ...newMenu, menuCategoryIds: selectedIds });
  };
  const dispatch = useAppDispatch();

  const handleCreateMenu = async () => {
    const newMenuPayload = { ...newMenu };
    if (menuImage) {
      const formData = new FormData();
      formData.append("files", menuImage as Blob);
      const response = await fetch(`${config.apiBaseUrl}/asset`, {
        method: "POST",
        body: formData,
      });
      const responseJson = await response.json();
      const assetUrl = responseJson.assetUrl;
      newMenuPayload.assetUrl = assetUrl;
    }
    dispatch(
      createMenuThunk({
        ...newMenuPayload,
        onSuccess: () => {
          setOpen(false);
          dispatch(toggleSnackbar({ message: "Created menu successfully" }));
        },
      })
    );
  };

  const onFileSelected = (files: File[]) => {
    setMenuImage(files[0]);
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewMenu(defaultNewMenu);
      }}
    >
      <DialogTitle>Create new Menu </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="name"
          type="text"
          sx={{ mt: 2 }}
          onChange={(e) => {
            setNewMenu({ ...newMenu, name: e.target.value });
          }}
        />
        <TextField
          label="price"
          type="number"
          onChange={(e) => {
            setNewMenu({ ...newMenu, price: Number(e.target.value) });
          }}
        />
        <FormControl fullWidth sx={{}}>
          <InputLabel>Menu Category</InputLabel>
          <Select
            multiple
            value={newMenu.menuCategoryIds}
            label="Menu Category"
            onChange={handleChange}
            sx={{ width: 400 }}
            renderValue={(selectMenuCategoryIds) => {
              return selectMenuCategoryIds
                .map((selectMenuCategoryId) => {
                  const menuCategory = menuCategories.find(
                    (item) => item.id === selectMenuCategoryId
                  ) as MenuCategory;
                  return menuCategory;
                })
                .map((item) => (
                  <Chip key={item.id} label={item.name} sx={{ mr: 1 }}></Chip>
                ));
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
            {menuCategories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Checkbox checked={newMenu.menuCategoryIds.includes(item.id)} />
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FileDropZone onFileSelected={onFileSelected} />
        {menuImage && (
          <Chip
            sx={{ mt: 2 }}
            label={menuImage.name}
            onDelete={() => setMenuImage(undefined)}
          ></Chip>
        )}
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
            disabled={
              !newMenu ||
              !newMenu.menuCategoryIds.length ||
              !newMenu.name.trim()
            }
            variant="contained"
            onClick={handleCreateMenu}
          >
            confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenu;
