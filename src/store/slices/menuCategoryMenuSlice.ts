import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { createSlice } from "@reduxjs/toolkit";

const initialState: MenuCategoryMenuSlice = {
  items: [],
  isLoading: false,
  isError: null,
};

const menuCategoryMenu = createSlice({
  name: "menuCategoryMenu",
  initialState,
  reducers: {
    setMenuCategoryMenus: (state, action) => {
      state.items = action.payload;
    },
    addMenuCategoryMenus: (state, { payload }) => {
      state.items = [...state.items, ...payload];
    },
    replaceMenuCategoryMenu: (state, action) => {
      const menuId = action.payload[0].menuId;
      const otherMenuCategoryMenus = state.items.filter(
        (item) => item.menuId !== menuId
      );
      state.items = [...otherMenuCategoryMenus, ...action.payload];
    },
  },
});

export const {
  setMenuCategoryMenus,
  addMenuCategoryMenus,
  replaceMenuCategoryMenu,
} = menuCategoryMenu.actions;
export default menuCategoryMenu.reducer;
