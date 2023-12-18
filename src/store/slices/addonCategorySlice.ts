import {
  AddonCategorySlice,
  CreateAddonCategoryOptions,
  DeleteAddonCategoryOption,
  UpdateAddonCategoryOptions,
} from "@/types/addonCategory";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuAddonCategory,
  replaceMenuAddonCategory,
} from "./menuAddonCategorySlice";

const initialState: AddonCategorySlice = {
  items: [],
  isLoading: false,
  isError: null,
};
export const createAddonCategoryThunk = createAsyncThunk(
  "addonCategories/createAddonCategory",
  async (options: CreateAddonCategoryOptions, thunkApi) => {
    const { name, isRequired, menuIds, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.backOfficeApiUrl}/addon-category`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, menuIds, isRequired }),
        }
      );
      const { addonCategory, menuAddonCategory } = await response.json();
      thunkApi.dispatch(addAddonCategory(addonCategory));
      thunkApi.dispatch(addMenuAddonCategory(menuAddonCategory));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const deleteAddonCategoryThunk = createAsyncThunk(
  "addonCategories/deleteAddonCategory",
  async (options: DeleteAddonCategoryOption, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.backOfficeApiUrl}/addon-category?id=${id}`,
        {
          method: "DELETE",
        }
      );
      thunkApi.dispatch(deleteAddonCategory({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const updateAddonCategoryThunk = createAsyncThunk(
  "addonCategories/updateAddonCategory",
  async (options: UpdateAddonCategoryOptions, thunkApi) => {
    const { id, name, isRequired, menuIds, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.backOfficeApiUrl}/addon-category`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, name, isRequired, menuIds }),
        }
      );
      const { menuAddonCategories, addonCategory } = await response.json();
      thunkApi.dispatch(replaceAddonCategory(addonCategory));
      thunkApi.dispatch(replaceMenuAddonCategory(menuAddonCategories));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

const addonCategorySlice = createSlice({
  name: "addonCategorySlice",
  initialState,
  reducers: {
    setAddonCategories: (state, { payload }) => {
      state.items = payload;
    },
    addAddonCategory: (state, { payload }) => {
      state.items = [...state.items, payload];
    },

    replaceAddonCategory: (state, { payload }) => {
      state.items = state.items.map((item) =>
        item.id === payload.id ? payload : item
      );
    },
    deleteAddonCategory: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  setAddonCategories,
  addAddonCategory,
  replaceAddonCategory,
  deleteAddonCategory,
} = addonCategorySlice.actions;
export default addonCategorySlice.reducer;
