import {
  CreateNewMenuOptions,
  DeleteMenuOptions,
  GetMenusOptions,
  MenuSlice,
  UpdateMenuOptions,
} from "@/types/menu";
import { config } from "@/utils/config";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  removeDisableLocationMenus,
  setDisableLocationMenus,
} from "./disableLocationMenuSlice";
import { removeMenuAddonCategory } from "./menuAddonCategorySlice";
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
        `${config.backOfficeApiUrl}/menu?locationId=${locationId}`
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
  async (options: CreateNewMenuOptions, thunkApi) => {
    const { name, price, assetUrl, menuCategoryIds, onSuccess, onError } =
      options;
    try {
      const response = await fetch(`${config.backOfficeApiUrl}/menu`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, assetUrl, price, menuCategoryIds }),
      });
      const { menu, menuCategoryMenus } = await response.json();
      thunkApi.dispatch(addMenu(menu));
      thunkApi.dispatch(addMenuCategoryMenus(menuCategoryMenus));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const updateMenuThunk = createAsyncThunk(
  "menus/updateMenu",
  async (options: UpdateMenuOptions, thunkApi) => {
    const {
      id,
      name,
      menuCategoryIds,
      price,
      assetUrl,
      locationId,
      isAvailable,
      onSuccess,
      onError,
    } = options;
    try {
      const response = await fetch(`${config.backOfficeApiUrl}/menu`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          menuCategoryIds,
          price,
          isAvailable,
          assetUrl,
          locationId,
        }),
      });
      const { menu, menuCategoryMenus, disabledLocationMenus } =
        await response.json();
      thunkApi.dispatch(replaceMenu(menu));
      thunkApi.dispatch(replaceMenuCategoryMenu(menuCategoryMenus));
      if (isAvailable === false && disabledLocationMenus) {
        thunkApi.dispatch(setDisableLocationMenus(disabledLocationMenus));
      } else {
        thunkApi.dispatch(
          removeDisableLocationMenus({ locationId, menuId: id })
        );
      }
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const deleteMenuThunk = createAsyncThunk(
  "menus/deleteMenu",
  async (options: DeleteMenuOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backOfficeApiUrl}/menu?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeMenus({ id }));
      thunkApi.dispatch(removeMenuAddonCategory({ menuId: id }));
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
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
  },
});

export const { setMenus, replaceMenu, removeMenus, addMenu, setLoading } =
  menuSlice.actions;
export default menuSlice.reducer;
