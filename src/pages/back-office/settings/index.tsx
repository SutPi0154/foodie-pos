import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCompanyThunk } from "@/store/slices/companySlice";
import { toggleSnackbar } from "@/store/slices/snackbarSlice";
import { UpdateCompanyOptions } from "@/types/company";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const SettingPage = () => {
  const company = useAppSelector((store) => store.company.item);
  const [data, setData] = useState<UpdateCompanyOptions>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      setData({
        id: company.id,
        name: company.name,
        street: company.street,
        township: company.township,
        city: company.city,
      });
    }
  }, [company]);

  if (!company || !data)
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

  const handleUpdateCompany = () => {
    dispatch(
      updateCompanyThunk({
        ...data,
        onSuccess: () => {
          dispatch(toggleSnackbar({ message: "Updated company successfully" }));
        },
      })
    );
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: { xs: 2 },
          gap: 2,
          width: { xs: "100%", lg: 600 },
        }}
      >
        <TextField
          label="name"
          sx={{ width: { xs: "90%", lg: 400 } }}
          defaultValue={data.name}
          onChange={(e) => {
            setData({ ...data, id: company.id, name: e.target.value });
          }}
        />
        <TextField
          label="street"
          sx={{ width: { xs: "90%", lg: 400 } }}
          defaultValue={data.street}
          onChange={(e) => {
            setData({ ...data, id: company.id, street: e.target.value });
          }}
        />
        <TextField
          label="name"
          sx={{ width: { xs: "90%", lg: 400 } }}
          defaultValue={data.township}
          onChange={(e) => {
            setData({ ...data, id: company.id, township: e.target.value });
          }}
        />
        <TextField
          label="name"
          sx={{ width: { xs: "90%", lg: 400 } }}
          defaultValue={data.city}
          onChange={(e) => {
            setData({ ...data, id: company.id, city: e.target.value });
          }}
        />

        <Box
          sx={{
            width: { xs: "90%", lg: 400 },
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button variant="contained" sx={{}} color="info">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateCompany}>
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingPage;
