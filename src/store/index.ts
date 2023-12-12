import { configureStore } from "@reduxjs/toolkit";
import addonCategoryReducer from "./slices/addonCategorySlice";
import addonReducer from "./slices/addonSlice";
import appReducer from "./slices/appSlice";
import cartReducer from "./slices/cartSlice";
import companyReducer from "./slices/companySlice";
import disableLocationMenuCategoryReducer from "./slices/disableLocationMenuCategorySlice";
import disableLocationMenuReducer from "./slices/disableLocationMenuSlice";
import locationReducer from "./slices/locationSlice";
import menuAddonCategoryReducer from "./slices/menuAddonCategorySlice";
import menuCategoryMenuReducer from "./slices/menuCategoryMenuSlice";
import menuCategoryReducer from "./slices/menuCategorySlice";
import menuReducer from "./slices/menuSlices";
import openDrawerReducer from "./slices/openDrawerSlice";
import orderReducer from "./slices/orderSlice";
import snackbarSliceReducer from "./slices/snackbarSlice";
import tableReducer from "./slices/tableSlice";
import userReducer from "./slices/userSlice";
// ...

export const store = configureStore({
  reducer: {
    app: appReducer,
    menu: menuReducer,
    menuCategory: menuCategoryReducer,
    addon: addonReducer,
    addonCategory: addonCategoryReducer,
    location: locationReducer,
    disableLocationMenuCategory: disableLocationMenuCategoryReducer,
    table: tableReducer,
    menuCategoryMenu: menuCategoryMenuReducer,
    menuAddonCategory: menuAddonCategoryReducer,
    snackbar: snackbarSliceReducer,
    disableLocationMenu: disableLocationMenuReducer,
    cart: cartReducer,
    order: orderReducer,
    company: companyReducer,
    openDrawer: openDrawerReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
