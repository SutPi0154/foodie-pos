import {
  AddonSlice,
  CreateAddonOptions,
  DeleteAddonOption,
  UpdateAddonOption,
} from "@/types/addon";
import { config } from "@/utils/config";
import { Addon } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AddonSlice = {
  items: [],
  isLoading: false,
  isError: null,
};
export const createAddonThunk = createAsyncThunk(
  "addon/createAddon",
  async (options: CreateAddonOptions, thunkApi) => {
    const { name, price, addonCategoryId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, price, addonCategoryId }),
      });
      const { addon } = await response.json();
      thunkApi.dispatch(addAddon(addon));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

export const updateAddonThunk = createAsyncThunk(
  "addons/updateAddon",
  async (options: UpdateAddonOption, thunkApi) => {
    const { id, name, addonCategoryId, price, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/addon`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, addonCategoryId, price }),
      });
      const { addon } = await response.json();
      thunkApi.dispatch(replaceAddon(addon));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const deleteAddonThunk = createAsyncThunk(
  "addons/updateAddon",
  async (options: DeleteAddonOption, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/addon?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeAddon({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
const addonSlice = createSlice({
  name: "addonSlice",
  initialState,
  reducers: {
    setAddons: (state, { payload }) => {
      state.items = payload;
    },
    replaceAddon: (state, { payload }: PayloadAction<Addon>) => {
      state.items = state.items.map((item) =>
        item.id === payload.id ? payload : item
      );
    },
    addAddon: (state, { payload }: PayloadAction<Addon>) => {
      state.items = [...state.items, payload];
    },
    removeAddon: (state, { payload }) => {
      state.items = state.items.filter((item) => item.id !== payload.id);
    },
  },
});

export const { setAddons, replaceAddon, addAddon, removeAddon } =
  addonSlice.actions;
export default addonSlice.reducer;
