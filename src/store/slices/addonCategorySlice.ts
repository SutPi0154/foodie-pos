import { AddonCategorySlice } from "@/types/addonCategory";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AddonCategorySlice = {
  items: [],
  isLoading: false,
  error: null,
};

const addonCategorySlice = createSlice({
  name: "addonCategorySlice",
  initialState,
  reducers: {
    setAddonCategories: (state, { payload }) => {
      state.items = payload;
    },
  },
});

export const { setAddonCategories } = addonCategorySlice.actions;
export default addonCategorySlice.reducer;
