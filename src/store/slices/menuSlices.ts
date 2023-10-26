import {
  CreateNewMenuOption,
  DeleteMenuOption,
  GetMenusOptions,
  MenuSlice,
  UpdateMenuOption,
} from "@/types/menu";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuCategoryMenus,
  replaceMenuCategoryMenu,
} from "./menuCategoryMenuSlice";

const initialState: MenuSlice = {
  items: [],
  isLoading: false,
  isError: null,
};
export const getMenusThunk = createAsyncThunk(
  "menus/setMenus",
  async (options: GetMenusOptions, thunkApi) => {
    const { locationId, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/menu?locationId=${locationId}`
      );
      const menus = await response.json();
      thunkApi.dispatch(setMenus(menus));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const createMenuThunk = createAsyncThunk(
  "menus/createMenu",
  async (options: CreateNewMenuOption, thunkApi) => {
    const { name, price, menuCategoryIds, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menus`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, menuCategoryIds }),
      });
      const { menu, menuCategoryMenu } = await response.json();
      thunkApi.dispatch(addMenu(menu));
      thunkApi.dispatch(addMenuCategoryMenus(menuCategoryMenu));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const UpdateMenuThunk = createAsyncThunk(
  "menus/updateMenu",
  async (options: UpdateMenuOption, thunkApi) => {
    const { id, name, menuCategoryIds, price, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menus`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, menuCategoryIds, price }),
      });
      const { menus, menuCategoryMenu } = await response.json();
      thunkApi.dispatch(replaceMenu(menus));
      thunkApi.dispatch(replaceMenuCategoryMenu(menuCategoryMenu));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const DeleteMenuThunk = createAsyncThunk(
  "menus/deleteMenu",
  async (options: DeleteMenuOption, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/menus?id=${id}`, {
        method: "DELETE",
      });
      // const { menus, menuCategoryMenu } = await response.json();
      thunkApi.dispatch(removeMenus({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const menuSlice = createSlice({
  name: "menuSlice",
  initialState,
  reducers: {
    setMenus: (state, { payload }) => {
      state.items = payload;
    },
    addMenu: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    replaceMenu: (state, { payload }) => {
      state.items = state.items.map((item) =>
        item.id === payload.id ? payload : item
      );
    },
    removeMenus: (state, { payload }) => {
      state.items = state.items.filter((item) => item.id !== payload.id);
    },
  },
});

export const { setMenus, replaceMenu, removeMenus, addMenu } =
  menuSlice.actions;
export default menuSlice.reducer;
