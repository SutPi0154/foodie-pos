import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteAddonThunk, updateAddonThunk } from "@/store/slices/addonSlice";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { UpdateAddonOption } from "@/types/addon";
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
import { AddonCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AddonDetail = () => {
  const router = useRouter();
  const addonId = Number(router.query.id);
  const addons = useAppSelector((store) => store.addon.items);

  const addonCategories = useAppSelector((store) => store.addonCategory.items);
  const [data, setData] = useState<UpdateAddonOption>();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const addon = addons.find((item) => item.id === addonId);

  useEffect(() => {
    if (addon) {
      setData({
        id: addon.id,
        name: addon.name,
        price: addon.price,
        addonCategoryId: addon.addonCategoryId,
      });
    }
  }, [addon]);

  if (!addon || !data)
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
  const handleChange = (e: SelectChangeEvent<number>) => {
    const selectedId = e.target.value as number;
    setData({ ...data, id: addon.id, addonCategoryId: selectedId });
  };

  const handleUpdateAddon = () => {
    dispatch(
      updateAddonThunk({
        ...data,
        onSuccess: () => {
          dispatch(toggleSnackbar({ message: "Updated menu successfully" }));
        },
      })
    );
  };
  const handleDeleteAddon = () => {
    dispatch(
      deleteAddonThunk({
        id: addon.id,
        onSuccess: () => {
          router.push("/back-office/addons");
          dispatch(toggleSnackbar({ message: "Deleted addon successfully" }));
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
          setData({ ...data, id: addon.id, name: e.target.value });
        }}
      />
      <TextField
        label="price"
        sx={{ width: 400 }}
        defaultValue={data.price}
        onChange={(e) => {
          setData({ ...data, id: addon.id, price: Number(e.target.value) });
        }}
        type="number"
      />
      <FormControl>
        <InputLabel>Addon Category</InputLabel>
        <Select
          onChange={handleChange}
          label="Addon Category"
          value={data.addonCategoryId}
          sx={{ width: 400 }}
          renderValue={(selectedAddonCategoryId) => {
            return (
              addonCategories.find(
                (item) => item.id === selectedAddonCategoryId
              ) as AddonCategory
            ).name;
          }}
        >
          {addonCategories.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={data.addonCategoryId === item.id}></Checkbox>
              <ListItemText primary={item.name}></ListItemText>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
        <Button variant="contained" onClick={handleUpdateAddon}>
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
          Are you sure you want to delete this addon?
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
            onClick={handleDeleteAddon}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AddonDetail;
