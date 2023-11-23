import { AppSlice, GetAppDataOptions } from "@/types/app";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setAddonCategories } from "./addonCategorySlice";
import { setAddons } from "./addonSlice";
import { setDisableLocationMenuCategories } from "./disableLocationMenuCategorySlice";
import { setDisableLocationMenus } from "./disableLocationMenuSlice";
import { setLocations } from "./locationSlice";
import { setMenuAddonCategory } from "./menuAddonCategorySlice";
import { setMenuCategoryMenus } from "./menuCategoryMenuSlice";
import { setMenuCategories } from "./menuCategorySlice";
import { setMenus } from "./menuSlices";
import { toggleSnackbar } from "./snackbarSlice";
import { setTables } from "./tableSlice";

const initialState: AppSlice = {
  init: false,
  isLoading: false,
  isError: null,
};
export const fetchAppData = createAsyncThunk(
  "app/appSlice",
  async (options: GetAppDataOptions, thunkApi) => {
    const { onSuccess, onError, companyId, tableId } = options;
    try {
      const appDataUrl =
        companyId && tableId
          ? `${config.apiBaseUrl}/app?companyId=${companyId}&tableId=${tableId}`
          : `${config.apiBaseUrl}/app`;
      const response = await fetch(appDataUrl);
      const appData = await response.json();
      const {
        locations,
        menuCategories,
        menus,
        menuCategoryMenus,
        addonCategories,
        menuAddonCategories,
        addons,
        tables,
        disabledLocationMenus,
        disabledLocationMenuCategories,
      } = appData;

      thunkApi.dispatch(setInit(true));
      thunkApi.dispatch(setLocations(locations));
      if (!localStorage.getItem("selectedLocationId")) {
        localStorage.setItem("selectedLocationId", locations[0].id);
      }
      thunkApi.dispatch(setMenuCategories(menuCategories));
      thunkApi.dispatch(setMenus(menus));
      thunkApi.dispatch(setMenuCategoryMenus(menuCategoryMenus));
      thunkApi.dispatch(setAddons(addons));
      thunkApi.dispatch(setAddonCategories(addonCategories));
      thunkApi.dispatch(setTables(tables));
      thunkApi.dispatch(setDisableLocationMenus(disabledLocationMenus));
      thunkApi.dispatch(
        setDisableLocationMenuCategories(disabledLocationMenuCategories)
      );
      thunkApi.dispatch(setMenuAddonCategory(menuAddonCategories));

      onSuccess && onSuccess(() => thunkApi.dispatch(toggleSnackbar("app ")));
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
