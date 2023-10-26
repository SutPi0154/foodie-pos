import {
  CreateMenuCategoryOptions,
  MenuCategorySlice,
} from "@/types/menuCategory";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

const menuCategorySlice = createSlice({
  name: "menuCategorySlice",
  initialState,
  reducers: {
    setMenuCategories: (state, { payload }) => {
      state.items = payload;
    },
    addMenuCategory: (state, action) => {
      state.items = [...state.items, action.payload];
    },
  },
});

export const { setMenuCategories, addMenuCategory } = menuCategorySlice.actions;
export default menuCategorySlice.reducer;
