import { DisableLocationMenuCategorySlice } from "@/types/disableLocationMenuCategory";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DisableLocationMenuCategorySlice = {
  items: [],
  isLoading: false,
  isError: null,
};

const disableLocationMenuCategorySlice = createSlice({
  name: "disableLocationMenuCategorySlice",
  initialState,
  reducers: {
    setDisableLocationMenuCategories: (state, { payload }) => {
      state.items = payload;
    },

    removeDisableLocationMenuCategory: (
      state,
      { payload }: PayloadAction<{ locationId: number; menuCategoryId: number }>
    ) => {
      const { locationId, menuCategoryId } = payload;
      state.items = state.items.filter(
        (item) =>
          !(
            item.locationId == locationId &&
            item.menuCategoryId == menuCategoryId
          )
      );
    },
  },
});

export const {
  setDisableLocationMenuCategories,
  removeDisableLocationMenuCategory,
} = disableLocationMenuCategorySlice.actions;
export default disableLocationMenuCategorySlice.reducer;
