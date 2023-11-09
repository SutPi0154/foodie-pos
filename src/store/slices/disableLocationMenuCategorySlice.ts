import { DisableLocationMenuCategorySlice } from "@/types/disableLocationMenuCategory";
import { DisabledLocationMenuCategory } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DisableLocationMenuCategorySlice = {
  items: [],
  isLoading: false,
  isError: null,
};

const disableLocationMenuCategorySlice = createSlice({
  name: "disableLocationMenuCategorySlice",
  initialState,
  reducers: {
    setDisableLocationMenuCategories: (state, { payload }) => {
      state.items = payload;
    },
    addDisableLocationMenuCategories: (
      state,
      { payload }: PayloadAction<DisabledLocationMenuCategory>
    ) => {
      state.items = [...state.items, payload];
    },
    replaceDisableLocationMenuCategory: (state, { payload }) => {
      // state.items = [...state.items, payload];
    },

    // removeMenuCategory: (state, { payload }: PayloadAction<{ id: number }>) => {
    //   state.items = state.items.filter((item) => item.id !== payload.id);
    // },
  },
});

export const {
  setDisableLocationMenuCategories,
  addDisableLocationMenuCategories,
} = disableLocationMenuCategorySlice.actions;
export default disableLocationMenuCategorySlice.reducer;
