import { AppSlice, GetAppDataOptions } from "@/types/app";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setAddonCategories } from "./addonCategorySlice";
import { setAddons } from "./addonSlice";
import { setLocations } from "./locationSlice";
import { setMenuAddonCategory } from "./menuAddonCategorySlice";
import { setMenuCategoryMenus } from "./menuCategoryMenuSlice";
import { setMenuCategories } from "./menuCategorySlice";
import { setMenus } from "./menuSlices";
import { setTables } from "./tableSlice";

const initialState: AppSlice = {
  init: false,
  isLoading: false,
  isError: null,
};
export const fetchAppData = createAsyncThunk(
  "app/appSlice",
  async (options: GetAppDataOptions, thunkApi) => {
    const { onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/app`);
      const appData = await response.json();
      const {
        locations,
        menuCategories,
        menus,
        menuCategoryMenus,
        menuAddonCategories,
        addonCategories,
        addons,
        tables,
      } = appData;
      thunkApi.dispatch(setInit(true));
      thunkApi.dispatch(setLocations(locations));
      thunkApi.dispatch(setMenuCategories(menuCategories));
      thunkApi.dispatch(setMenus(menus));
      thunkApi.dispatch(setMenuCategoryMenus(menuCategoryMenus));
      thunkApi.dispatch(setAddons(addons));
      thunkApi.dispatch(setAddonCategories(addonCategories));
      thunkApi.dispatch(setTables(tables));
      thunkApi.dispatch(setMenuAddonCategory(menuAddonCategories));

      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setInit: (state, action) => {
      state.init = action.payload;
    },
  },
});
export const { setInit } = appSlice.actions;
export default appSlice.reducer;
