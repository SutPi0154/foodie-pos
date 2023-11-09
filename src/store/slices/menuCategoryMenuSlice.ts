import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { MenuCategoryMenu } from "@prisma/client";
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
    filterReplaceMenuCategoryMenu: (
      state,
      { payload }: PayloadAction<MenuCategoryMenu[]>
    ) => {
      const menuCategoryId = payload[0].menuCategoryId;
      const otherMenuAddonCategory = state.items.filter(
        (item) => item.menuCategoryId !== menuCategoryId
      );
      state.items = [...otherMenuAddonCategory, ...payload];
    },
  },
});

export const {
  setMenuCategoryMenus,
  addMenuCategoryMenus,
  replaceMenuCategoryMenu,
  removeMenuCategoryMenu,
  filterReplaceMenuCategoryMenu,
} = menuCategoryMenu.actions;
export default menuCategoryMenu.reducer;
