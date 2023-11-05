import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: MenuAddonCategorySlice = {
  items: [],
  isLoading: false,
  isError: null,
};

const menuAddonCategorySlice = createSlice({
  name: "menuAddonCategory",
  initialState,
  reducers: {
    setMenuAddonCategory: (state, action) => {
      state.items = action.payload;
    },
    addMenuAddonCategory: (state, { payload }) => {
      state.items = [...state.items, ...payload];
    },
    replaceMenuAddonCategory: (state, action) => {
      const addonCategoryId = action.payload[0].addonCategoryId;
      const otherMenuAddonCategory = state.items.filter(
        (item) => item.addonCategoryId !== addonCategoryId
      );
      state.items = [...otherMenuAddonCategory, ...action.payload];
    },
    removeMenuAddonCategory: (
      state,
      { payload }: PayloadAction<{ menuId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuId !== payload.menuId
      );
    },
  },
});

export const {
  setMenuAddonCategory,
  addMenuAddonCategory,
  replaceMenuAddonCategory,
  removeMenuAddonCategory,
} = menuAddonCategorySlice.actions;
export default menuAddonCategorySlice.reducer;
