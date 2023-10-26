import { configureStore } from "@reduxjs/toolkit";
import AddonCategoryReducer from "./slices/addonCategorySlice";
import AddonReducer from "./slices/addonSlice";
import appReducer from "./slices/appSlice";
import LocationReducer from "./slices/locationSlice";
import MenuCategoryMenuReducer from "./slices/menuCategoryMenuSlice";
import MenuCategoryReducer from "./slices/menuCategorySlice";
import MenuReducer from "./slices/menuSlices";
import TableReducer from "./slices/tableSlice";
// ...

export const store = configureStore({
  reducer: {
    app: appReducer,
    menus: MenuReducer,
    menuCategories: MenuCategoryReducer,
    addons: AddonReducer,
    addonCategories: AddonCategoryReducer,
    locations: LocationReducer,
    tables: TableReducer,
    menuCategoryMenus: MenuCategoryMenuReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
