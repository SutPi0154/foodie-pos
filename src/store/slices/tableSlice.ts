import { TableSlice } from "@/types/table";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TableSlice = {
  items: [],
  isLoading: false,
  error: null,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTables: (state, { payload }) => {
      state.items = payload;
    },
  },
});

export const { setTables } = tableSlice.actions;
export default tableSlice.reducer;
