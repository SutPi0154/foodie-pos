import { OpenDrawer } from "@/types/openDrawer";
import { createSlice } from "@reduxjs/toolkit";

const initialState: OpenDrawer = {
  open: false,
};

const openDrawerSlice = createSlice({
  name: "openDrawer",
  initialState,
  reducers: {
    setOpenDrawer: (state) => {
      state.open = true;
    },
    setCloseDrawer: (state) => {
      state.open = false;
    },
  },
});

export const { setOpenDrawer, setCloseDrawer } = openDrawerSlice.actions;
export default openDrawerSlice.reducer;
