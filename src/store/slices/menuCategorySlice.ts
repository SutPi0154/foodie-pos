import {
  CreateMenuCategoryOptions,
  DeleteMenuCategoryOption,
  MenuCategorySlice,
  UpdateMenuCategoryOptions,
} from "@/types/menuCategory";
import { config } from "@/utils/config";
import { MenuCategory } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  removeDisableLocationMenuCategory,
  setDisableLocationMenuCategories,
} from "./disableLocationMenuCategorySlice";
import {
  removeMenuCategoryMenu,
  replaceMenuCategoryMenu,
} from "./menuCategoryMenuSlice";

const initialState: MenuCategorySlice = {
  items: [],
  isLoading: false,
  isError: null,
};

export const createMenuCategory = createAsyncThunk(
  "menuCategory/setMenuCategories",
  async (options: CreateMenuCategoryOptions, thunkApi) => {
    const { name, locationId, onSuccess, onError } = options;
    try {
      const api = await fetch(`${config.apiBaseUrl}/menu-category`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, locationId }),
      });
      const menuCategory = await api.json();
      thunkApi.dispatch(addMenuCategory(menuCategory));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateMenuCategoryThunk = createAsyncThunk(
  "menuCategory/updateMenuCategory",
  async (options: UpdateMenuCategoryOptions, thunkApi) => {
    const { id, name, companyId, isAvailable, locationId, onSuccess, onError } =
      options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-category`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, companyId, isAvailable, locationId }),
      });
      const { menuCategory, menuCategoryMenu, disabledLocationMenuCategory } =
        await response.json();
      if (!menuCategoryMenu && isAvailable === false) {
        thunkApi.dispatch(
          setDisableLocationMenuCategories(disabledLocationMenuCategory)
        );
        thunkApi.dispatch(replaceMenuCategory(menuCategory));
      } else if (!menuCategoryMenu && isAvailable === true) {
        thunkApi.dispatch(replaceMenuCategory(menuCategory));
        thunkApi.dispatch(
          removeDisableLocationMenuCategory({
            locationId,
            menuCategoryId: id,
          })
        );
      } else if (menuCategoryMenu && isAvailable === true) {
        thunkApi.dispatch(
          removeDisableLocationMenuCategory({
            locationId: locationId,
            menuCategoryId: id,
          })
        );
        thunkApi.dispatch(replaceMenuCategoryMenu(menuCategoryMenu));
        thunkApi.dispatch(replaceMenuCategory(menuCategory));
      } else if (menuCategoryMenu && isAvailable === false) {
        thunkApi.dispatch(replaceMenuCategoryMenu(menuCategoryMenu));
        thunkApi.dispatch(replaceMenuCategory(menuCategory));
        thunkApi.dispatch(
          setDisableLocationMenuCategories(disabledLocationMenuCategory)
        );
      }

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const deleteMenuCategoryThunk = createAsyncThunk(
  "menuCategory/deleteMenuCategory",
  async (options: DeleteMenuCategoryOption, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/menu-category?id=${id}`,
        {
          method: "DELETE",
        }
      );
      thunkApi.dispatch(removeMenuCategory({ id }));
      thunkApi.dispatch(removeMenuCategoryMenu({ menuCategoryId: id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const menuCategorySlice = createSlice({
  name: "menuCategorySlice",
  initialState,
  reducers: {
    setMenuCategories: (state, { payload }) => {
      state.items = payload;
    },
    addMenuCategory: (state, { payload }: PayloadAction<MenuCategory>) => {
      state.items = [...state.items, payload];
    },
    replaceMenuCategory: (state, { payload }: PayloadAction<MenuCategory>) => {
      state.items = state.items.map((item) =>
        item.id === payload.id ? payload : item
      );
    },

    removeMenuCategory: (state, { payload }: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== payload.id);
    },
  },
});

export const {
  setMenuCategories,
  addMenuCategory,
  replaceMenuCategory,
  removeMenuCategory,
} = menuCategorySlice.actions;
export default menuCategorySlice.reducer;
