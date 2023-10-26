import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { DeleteMenuThunk, UpdateMenuThunk } from "@/store/slices/menuSlices";
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
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Update = () => {
  const router = useRouter();
  const id = Number(router.query.id);
  const menus = useAppSelector((store) => store.menus.items);
  const menuCategoryMenus = useAppSelector(
    (store) => store.menuCategoryMenus.items
  );
  const menuCategories = useAppSelector((store) => store.menuCategories.items);
  const [data, setData] = useState<UpdateMenuOption>();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const menu = menus.find((item) => item.id === id);
  const menuCategoryMenu = menuCategoryMenus.filter(
    (item) => item.menuId === id
  );
  const menuCategoryIds = menuCategoryMenu.map((item) => item.menuCategoryId);
  useEffect(() => {
    if (menu) {
      setData({
        id,
        name: menu.name,
        price: menu.price,
        menuCategoryIds,
      });
    }
  }, [menu]);

  if (!menu || !data)
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
  const handleChange = (e: SelectChangeEvent<number[]>) => {
    const selectedId = e.target.value as number[];
    setData({ ...data, id, menuCategoryIds: selectedId });
  };

  const handleMenuUpdate = () => {
    dispatch(UpdateMenuThunk(data));
  };
  const handleMenuDelete = () => {
    dispatch(
      DeleteMenuThunk({
        id,
        onSuccess: () => {
          router.push("/back-office/menus");
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
      <Box
        sx={{ width: 400, display: "flex", justifyContent: "center", gap: 2 }}
      >
        <Button
          variant="outlined"
          sx={{}}
          onClick={() => {
            router.push("/back-office/menus");
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleMenuUpdate}>
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
            variant="outlined"
            onClick={() => {
              setOpen(false);
            }}
            color="error"
          >
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleMenuDelete} color="primary">
            Confirm
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Update;
