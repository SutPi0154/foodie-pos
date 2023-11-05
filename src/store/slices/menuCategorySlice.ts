import {
  CreateMenuCategoryOptions,
  DeleteMenuCategoryOption,
  MenuCategorySlice,
  UpdateMenuCategoryOptions,
} from "@/types/menuCategory";
import { config } from "@/utils/config";
import { MenuCategory } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { removeMenuCategoryMenu } from "./menuCategoryMenuSlice";

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
    const { id, name, companyId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menu-category`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, companyId }),
      });
      const { menuCategory } = await response.json();
      replaceMenuCategory(menuCategory);
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
