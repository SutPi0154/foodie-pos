import { configureStore } from "@reduxjs/toolkit";
import AddonCategoryReducer from "./slices/addonCategorySlice";
import AddonReducer from "./slices/addonSlice";
import appReducer from "./slices/appSlice";
import disableLocationMenuCategoryReducer from "./slices/disableLocationMenuCategorySlice";
import disableLocationMenuReducer from "./slices/disableLocationMenuSlice";
import LocationReducer from "./slices/locationSlice";
import MenuAddonCategoryReducer from "./slices/menuAddonCategorySlice";
import MenuCategoryMenuReducer from "./slices/menuCategoryMenuSlice";
import MenuCategoryReducer from "./slices/menuCategorySlice";
import MenuReducer from "./slices/menuSlices";
import snackbarSliceReducer from "./slices/snackbarSlice";
import TableReducer from "./slices/tableSlice";
// ...

export const store = configureStore({
  reducer: {
    app: appReducer,
    menu: MenuReducer,
    menuCategory: MenuCategoryReducer,
    addon: AddonReducer,
    addonCategory: AddonCategoryReducer,
    location: LocationReducer,
    disableLocationMenuCategory: disableLocationMenuCategoryReducer,
    table: TableReducer,
    menuCategoryMenu: MenuCategoryMenuReducer,
    menuAddonCategory: MenuAddonCategoryReducer,
    snackbar: snackbarSliceReducer,
    disableLocationMenu: disableLocationMenuReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
