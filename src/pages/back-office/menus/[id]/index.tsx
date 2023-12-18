import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteMenuThunk, updateMenuThunk } from "@/store/slices/menuSlices";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { UpdateMenuOptions } from "@/types/menu";
import { config } from "@/utils/config";
import {
  Box,
  Button,
  CardMedia,
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
import { ChangeEvent, useEffect, useMemo, useState } from "react";

const MenuDetail = () => {
  const router = useRouter();
  const menuId = Number(router.query.id);
  const menus = useAppSelector((store) => store.menu.items);
  const menuCategoryMenus = useAppSelector(
    (store) => store.menuCategoryMenu.items
  );
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const [data, setData] = useState<UpdateMenuOptions>();
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
  const handleMenuImageUpdate = async (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (files) {
      const file = files[0];
      const formData = new FormData();

      formData.append("files", file as Blob);
      const response = await fetch(`${config.backOfficeApiUrl}/asset`, {
        method: "POST",
        body: formData,
      });
      const { assetUrl } = await response.json();
      dispatch(
        updateMenuThunk({
          ...data,
          assetUrl,
          onSuccess: () => {
            dispatch(toggleSnackbar({ message: "Updated menu successfully" }));
          },
        })
      );
    }
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
        gap: 2,
        alignItems: "center",
        width: { xs: "100%" },
        mb: 4,
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
          sx={{ width: "fit-content", mr: { xs: 2 } }}
          onClick={() => {
            setOpen(true);
          }}
        >
          delete
        </Button>
      </Box>

      <Box
        sx={{
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <CardMedia
            component="img"
            image={menu.assetUrl || "/default-menu.png"}
            sx={{
              objectFit: "contain",
              height: { xs: 200, md: 300 },
              borderRadius: 4,
            }}
          />
        </Box>
        <Button
          sx={{ width: "fit-content", mt: 2, mb: 2 }}
          variant="contained"
          component="label"
        >
          Upload file
          <input type="file" hidden onChange={handleMenuImageUpdate} />
        </Button>
      </Box>
      <TextField
        label="name"
        defaultValue={menu.name}
        sx={{ width: { xs: "90%" } }}
        onChange={(e) => {
          setData({ ...data, name: e.target.value });
        }}
      />
      <TextField
        label="price"
        defaultValue={menu.price}
        sx={{ width: { xs: "90%" } }}
        onChange={(e) => {
          setData({ ...data, price: Number(e.target.value) });
        }}
        type="number"
      />
      <FormControl sx={{ width: { xs: "90%" } }}>
        <InputLabel>Menu Category</InputLabel>
        <Select
          multiple
          onChange={handleChange}
          label="menuCategory"
          value={data.menuCategoryIds}
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
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
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
