import { useAppSelector } from "@/store/hooks";
import { CreateNewMenuOption } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
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
  const menuCategories = useAppSelector((state) => state.menuCategories.items);

  const [newMenu, setNewMenu] = useState(defaultNewMenu);
  const handleChange = (e: SelectChangeEvent<number[]>) => {
    const selectedIds = e.target.value as number[];
    setNewMenu({ ...newMenu, menuCategoryIds: selectedIds });
  };
  const handleCreateMenu = () => {
    console.log(newMenu);
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
          onChange={(e) => {
            setNewMenu({ ...newMenu, name: e.target.value });
          }}
        />
        <TextField
          label="price"
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
                .map((item) => item.name)
                .join(", ");
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
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
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
