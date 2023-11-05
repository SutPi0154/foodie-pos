import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { deleteTableThunk, updateTableThunk } from "@/store/slices/tableSlice";
import { UpdateTableOption } from "@/types/table";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TableDetail = () => {
  const router = useRouter();
  const tableId = Number(router.query.id);
  const tables = useAppSelector((store) => store.table.items);
  const locations = useAppSelector((store) => store.location.items);
  const table = tables.find((item) => item.id === tableId);
  const [data, setData] = useState<UpdateTableOption>();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  console.log(table);
  useEffect(() => {
    if (table) {
      setData({
        id: table.id,
        name: table.name,
        locationId: table.locationId,
      });
    }
  }, [table]);
  console.log(table);

  if (!table || !data)
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

  const handleUpdateTable = () => {
    dispatch(
      updateTableThunk({
        ...data,
        onSuccess: () => {
          dispatch(toggleSnackbar({ message: "Updated table successfully" }));
        },
      })
    );
  };
  const handleDeleteTable = () => {
    dispatch(
      deleteTableThunk({
        id: tableId,
        onSuccess: () => {
          router.push("/back-office/tables");
          dispatch(toggleSnackbar({ message: "Deleted table successfully" }));
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
          setData({ ...data, id: table.id, name: e.target.value });
        }}
      />

      <Box
        sx={{ width: 400, display: "flex", justifyContent: "center", gap: 2 }}
      >
        <Button
          variant="contained"
          sx={{}}
          color="info"
          onClick={() => {
            router.push("/back-office/tables");
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleUpdateTable}>
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
          Are you sure you want to delete this table?
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
            onClick={handleDeleteTable}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TableDetail;
