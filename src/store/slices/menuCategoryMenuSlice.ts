import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
    removeMenuCategoryMenu: (
      state,
      { payload }: PayloadAction<{ menuCategoryId: number }>
    ) => {
      state.items = state.items.filter(
        (item) => item.menuCategoryId !== payload.menuCategoryId
      );
    },
  },
});

export const {
  setMenuCategoryMenus,
  addMenuCategoryMenus,
  replaceMenuCategoryMenu,
  removeMenuCategoryMenu,
} = menuCategoryMenu.actions;
export default menuCategoryMenu.reducer;
