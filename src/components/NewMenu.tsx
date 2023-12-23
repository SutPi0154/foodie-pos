import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createMenuThunk, setLoading } from "@/store/slices/menuSlices";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { CreateNewMenuOptions } from "@/types/menu";
import { config } from "@/utils/config";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";

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
const defaultNewMenu: CreateNewMenuOptions = {
  name: "",
  assetUrl: undefined,
  price: 0,
  menuCategoryIds: [],
};
const NewMenu = ({ open, setOpen }: Props) => {
  const { isLoading }: any = useAppSelector((item) => item.menu);
  const menuCategories = useAppSelector((state) => state.menuCategory.items);

  const [newMenu, setNewMenu] = useState(defaultNewMenu);
  const [menuImage, setMenuImage] = useState<File>();
  const handleChange = (e: SelectChangeEvent<number[]>) => {
    const selectedIds = e.target.value as number[];
    setNewMenu({ ...newMenu, menuCategoryIds: selectedIds });
  };
  const dispatch = useAppDispatch();

  const handleCreateMenu = async () => {
    dispatch(setLoading(true));
    const newMenuPayload = { ...newMenu };
    if (menuImage) {
      const formData = new FormData();
      formData.append("files", menuImage as Blob);
      const response = await fetch(`${config.backOfficeApiUrl}/asset`, {
        method: "POST",
        body: formData,
      });
      const { assetUrl } = await response.json();
      newMenuPayload.assetUrl = assetUrl;
    }
    dispatch(
      createMenuThunk({
        ...newMenuPayload,
        onSuccess: () => {
          setOpen(false);
          setNewMenu(defaultNewMenu);
          dispatch(toggleSnackbar({ message: "Created menu successfully" }));
          dispatch(setLoading(false));
        },
        onError: () => {
          dispatch(setLoading(false));
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
              setNewMenu(defaultNewMenu);
            }}
          >
            cancel
          </Button>
          <LoadingButton
            disabled={
              !newMenu ||
              !newMenu.menuCategoryIds.length ||
              !newMenu.name.trim()
            }
            variant="contained"
            onClick={handleCreateMenu}
            loading={isLoading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
          >
            {isLoading === true ? "loading" : "confirm"}
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenu;
