import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteMenuCategoryThunk,
  updateMenuCategoryThunk,
} from "@/store/slices/menuCategorySlice";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { UpdateMenuCategoryOptions } from "@/types/menuCategory";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuCategoryDetail = () => {
  const router = useRouter();
  const menuCategoryId = Number(router.query.id);
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const menuCategory = menuCategories.find(
    (item) => item.id === menuCategoryId
  );
  const [data, setData] = useState<UpdateMenuCategoryOptions>();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const disableLocationMenuCategory = useAppSelector(
    (store) => store.disableLocationMenuCategory.items
  );

  useEffect(() => {
    if (menuCategory) {
      const isDisable = disableLocationMenuCategory.find(
        (item) =>
          item?.locationId ===
            Number(localStorage.getItem("selectedLocationId")) &&
          item.menuCategoryId === menuCategoryId
      );
      const locationId = Number(localStorage.getItem("selectedLocationId"));
      console.log(locationId);
      setData({
        id: menuCategory.id,
        name: menuCategory.name,
        companyId: menuCategory.companyId,
        isAvailable: isDisable ? false : true,
        locationId,
      });
    }
  }, [menuCategory, disableLocationMenuCategory, menuCategoryId]);
  console.log(menuCategory, disableLocationMenuCategory);
  console.log(menuCategoryId);
  if (!menuCategory || !data)
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

  const handleUpdateMenuCategory = () => {
    console.log(data);
    dispatch(
      updateMenuCategoryThunk({
        ...data,
        onSuccess: () => {
          dispatch(
            toggleSnackbar({ message: "Updated menu category successfully" })
          );
        },
      })
    );
  };
  const handleDeleteMenuCategory = () => {
    dispatch(
      deleteMenuCategoryThunk({
        id: menuCategoryId,
        onSuccess: () => {
          router.push("/back-office/menu-categories");
          dispatch(
            toggleSnackbar({ message: "Deleted menu category successfully" })
          );
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
        defaultValue={data.name}
        onChange={(e) => {
          setData({ ...data, id: menuCategory.id, name: e.target.value });
        }}
      />
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
            router.push("/back-office/menu-categories");
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleUpdateMenuCategory}>
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
          Are you sure you want to delete this menu category?
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
            onClick={handleDeleteMenuCategory}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MenuCategoryDetail;
