import { AddonSlice } from "@/types/addon";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AddonSlice = {
  items: [],
  isLoading: false,
  isError: null,
};

const addonSlice = createSlice({
  name: "addonSlice",
  initialState,
  reducers: {
    setAddons: (state, { payload }) => {
      state.items = payload;
    },
  },
});

export const { setAddons } = addonSlice.actions;
export default addonSlice.reducer;
