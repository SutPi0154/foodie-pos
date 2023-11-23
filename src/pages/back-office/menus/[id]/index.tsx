import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteMenuThunk, updateMenuThunk } from "@/store/slices/menuSlices";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { UpdateMenuOption } from "@/types/menu";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
  Switch,
  TextField,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const MenuDetail = () => {
  const router = useRouter();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((store) => store.menu.items);
  const menuCategoryMenus = useAppSelector(
    (store) => store.menuCategoryMenu.items
  );
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const [data, setData] = useState<UpdateMenuOption>();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const menu = menus.find((item) => item.id === menuId);

  const CurrentMenuCategoryMenu = useMemo(() => {
    return menuCategoryMenus.filter((item) => item.menuId === menuId);
  }, [menuCategoryMenus, menuId]);
  const disableLocationMenu = useAppSelector(
    (store) => store.disableLocationMenu.items
  );

  useEffect(() => {
    const selectedLocationId = Number(
      localStorage.getItem("selectedLocationId")
    );
    if (menu) {
      const isDisable = disableLocationMenu.find(
        (item) =>
          item?.locationId === selectedLocationId && item.menuId === menuId
      );
      const menuCategoryIds = CurrentMenuCategoryMenu.map(
        (item) => item.menuCategoryId
      );
      setData({
        ...menu,
        menuCategoryIds,
        locationId: selectedLocationId,
        isAvailable: isDisable ? false : true,
      });
    }
  }, [menu, CurrentMenuCategoryMenu, disableLocationMenu, menuId]);
  if (!menu || !data) {
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
  }

  const handleChange = (e: SelectChangeEvent<number[]>) => {
    const selectedId = e.target.value as number[];
    setData({ ...data, id: menuId, menuCategoryIds: selectedId });
  };

  const handleUpdateMenu = () => {
    dispatch(
      updateMenuThunk({
        ...data,
        onSuccess: () => {
          dispatch(toggleSnackbar({ message: "Updated menu successfully" }));
        },
      })
    );
  };
  const handleDeleteMenu = () => {
    dispatch(
      deleteMenuThunk({
        id: menuId,
        onSuccess: () => {
          router.push("/back-office/menus");
          dispatch(toggleSnackbar({ message: "Deleted menu successfully" }));
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
        defaultValue={menu.name}
        onChange={(e) => {
          setData({ ...data, name: e.target.value });
        }}
      />
      <TextField
        label="price"
        sx={{ width: 400 }}
        defaultValue={menu.price}
        onChange={(e) => {
          setData({ ...data, price: Number(e.target.value) });
        }}
        type="number"
      />
      <FormControl>
        <InputLabel>Menu Category</InputLabel>
        <Select
          multiple
          onChange={handleChange}
          label="menuCategory"
          value={data.menuCategoryIds}
          sx={{ width: 400 }}
          renderValue={(selectedIds) => {
            return selectedIds
              .map((selectedId) => {
                return menuCategories.find(
                  (item) => item.id === selectedId
                ) as MenuCategory;
              })
              .map((item) => item.name)
              .join(", ");
          }}
        >
          {menuCategories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox
                checked={data.menuCategoryIds?.includes(item.id)}
              ></Checkbox>
              <ListItemText primary={item.name}></ListItemText>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            defaultChecked={data.isAvailable}
            onChange={(e, value) => {
              setData({ ...data, isAvailable: value });
            }}
          />
        }
        label="is available"
      />
      <Box
        sx={{ width: 400, display: "flex", justifyContent: "center", gap: 2 }}
      >
        <Button
          variant="contained"
          sx={{}}
          color="info"
          onClick={() => {
            router.push("/back-office/menus");
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleUpdateMenu}>
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
          Are you sure you want to delete this menu?
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
            onClick={handleDeleteMenu}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MenuDetail;
