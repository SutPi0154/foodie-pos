import { DisableLocationMenuSlice } from "@/types/disableLocationMenu";
import { DisabledLocationMenu } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DisableLocationMenuSlice = {
  items: [],
  isLoading: false,
  isError: null,
};

const disableLocationMenuSlice = createSlice({
  name: "disableLocationMenuSlice",
  initialState,
  reducers: {
    setDisableLocationMenus: (state, { payload }) => {
      state.items = payload;
    },
    addDisableLocationMenus: (
      state,
      { payload }: PayloadAction<DisabledLocationMenu[]>
    ) => {
      state.items = [...state.items, ...payload];
    },

    removeDisableLocationMenus: (
      state,
      { payload }: PayloadAction<{ locationId: number; menuId: number }>
    ) => {
      const { locationId, menuId } = payload;
      state.items = state.items.filter(
        (item) => !(item.locationId == locationId && item.menuId == menuId)
      );
    },
  },
});

export const {
  setDisableLocationMenus,
  addDisableLocationMenus,
  removeDisableLocationMenus,
} = disableLocationMenuSlice.actions;
export default disableLocationMenuSlice.reducer;
