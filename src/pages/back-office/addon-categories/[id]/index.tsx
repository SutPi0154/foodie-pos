import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteAddonCategoryThunk,
  updateAddonCategoryThunk,
} from "@/store/slices/addonCategorySlice";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { UpdateAddonCategoryOptions } from "@/types/addonCategory";
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AddonCategoryDetail = () => {
  const router = useRouter();
  const addonCategoryId = Number(router.query.id);
  const addonCategories = useAppSelector((state) => state.addonCategory.items);
  const menuAddonCategories = useAppSelector(
    (state) => state.menuAddonCategory.items
  );
  const menus = useAppSelector((state) => state.menu.items);
  const addonCategory = addonCategories.find(
    (item) => item.id === addonCategoryId
  );
  const currentMenuAddonCategories = menuAddonCategories.filter(
    (item) => item.addonCategoryId === addonCategoryId
  );
  const menuIds = currentMenuAddonCategories.map((item) => item.menuId);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UpdateAddonCategoryOptions>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addonCategory) {
      setData({ ...addonCategory, menuIds });
    }
  }, [addonCategory]);
  if (!addonCategory || !data) return null;

  const handleDeleteAddonCategory = () => {
    dispatch(
      deleteAddonCategoryThunk({
        id: addonCategoryId,
        onSuccess: () => {
          router.push("/back-office/addon-categories");
          dispatch(
            toggleSnackbar({ message: "Deleted addon category successfully" })
          );
        },
      })
    );
  };

  if (!addonCategory || !data) return null;
  const handleUpdateAddonCategory = () => {
    const isValid = data.name.trim() !== "" && data.menuIds.length > 0;
    if (!isValid) return;
    dispatch(
      updateAddonCategoryThunk({
        ...data,
        onSuccess: () => {
          dispatch(
            toggleSnackbar({ message: "Updated addon category successfully" })
          );
        },
      })
    );
  };
  const handleChange = (e: SelectChangeEvent<number[]>) => {
    const selectIds = e.target.value as number[];
    setData({ ...data, id: addonCategoryId, menuIds: selectIds });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: { xs: "100%", lg: 600 },
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
        sx={{ width: { xs: "90%", lg: 400 } }}
        label="addon category"
        defaultValue={addonCategory.name}
        onChange={(e) => {
          setData({ ...data, name: e.target.value });
        }}
      />
      <FormControl sx={{ width: { xs: "90%", lg: 400 } }}>
        <InputLabel>menus</InputLabel>
        <Select
          multiple
          onChange={handleChange}
          label="menus"
          value={data.menuIds}
          sx={{ width: { xs: "100%", lg: 400 } }}
          renderValue={(selectedMenuIds) => {
            return selectedMenuIds
              .map((selectedMenuId) => {
                return menus.find((item) => item.id === selectedMenuId) as Menu;
              })
              ?.map((item) => (
                <Chip key={item.id} label={item.name} sx={{ mr: 1 }} />
              ));
          }}
        >
          {menus.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={data.menuIds.includes(item.id)}></Checkbox>
              <ListItemText primary={item.name}></ListItemText>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={<Checkbox defaultChecked={addonCategory.isRequired} />}
        onChange={(e, value) => {
          setData({ ...data, isRequired: value });
        }}
        label="is required"
      />
      <Box
        sx={{
          width: { xs: "100%", lg: 400 },
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            router.push("/back-office/addon-categories");
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleUpdateAddonCategory}>
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
          Are you sure you want to delete this addon category?
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
            onClick={handleDeleteAddonCategory}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AddonCategoryDetail;
