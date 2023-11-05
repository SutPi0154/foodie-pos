import { useAppDispatch } from "@/store/hooks";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { createTableThunk } from "@/store/slices/tableSlice";
import { CreateTableOptions } from "@/types/table";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const defaultNewTable = {
  name: "",
  locationId: undefined,
};
const NewTable = ({ open, setOpen }: Props) => {
  const [newTable, setNewTable] = useState<CreateTableOptions>(defaultNewTable);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setNewTable((prevData) => ({
      ...prevData,
      locationId: Number(localStorage.getItem("selectedLocationId")),
    }));
  }, []);

  console.log(newTable);
  const handleCreateTable = () => {
    dispatch(
      createTableThunk({
        ...newTable,
        onSuccess: () => {
          setOpen(false);
          dispatch(toggleSnackbar({ message: "Created table successfully" }));
        },
      })
    );
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setNewTable(defaultNewTable);
      }}
    >
      <DialogTitle>Create new Table </DialogTitle>
      <DialogContent>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="name"
            type="text"
            sx={{ mt: 2, width: 400 }}
            onChange={(e) => {
              setNewTable({ ...newTable, name: e.target.value });
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
              }}
              sx={{}}
            >
              cancel
            </Button>
            <Button
              disabled={
                !newTable || !newTable.locationId || !newTable.name.trim()
              }
              variant="contained"
              onClick={handleCreateTable}
            >
              confirm
            </Button>
          </Box>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
};

export default NewTable;
