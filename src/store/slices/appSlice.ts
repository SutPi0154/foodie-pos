import { AppSlice, GetAppDataOptions } from "@/types/app";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setAddonCategories } from "./addonCategorySlice";
import { setAddons } from "./addonSlice";
import { setDisableLocationMenuCategories } from "./disableLocationMenuCategorySlice";
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
        location,
        menuCategory,
        menu,
        menuCategoryMenu,
        menuAddonCategory,
        addonCategory,
        addon,
        disableLocationMenuCategory,
        table,
      } = appData;

      console.log(
        location,
        menuCategory,
        menu,
        menuCategoryMenu,
        menuAddonCategory,
        addonCategory,
        addon,
        table
      );
      thunkApi.dispatch(setInit(true));
      thunkApi.dispatch(setLocations(location));
      if (!localStorage.getItem("selectedLocationId")) {
        localStorage.setItem("selectedLocationId", location[0].id);
      }
      thunkApi.dispatch(setMenuCategories(menuCategory));
      thunkApi.dispatch(setMenus(menu));
      thunkApi.dispatch(setMenuCategoryMenus(menuCategoryMenu));
      thunkApi.dispatch(setAddons(addon));
      thunkApi.dispatch(setAddonCategories(addonCategory));
      thunkApi.dispatch(setTables(table));
      thunkApi.dispatch(
        setDisableLocationMenuCategories(disableLocationMenuCategory)
      );
      thunkApi.dispatch(setMenuAddonCategory(menuAddonCategory));

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
