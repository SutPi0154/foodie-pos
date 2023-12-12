import { UserSlice } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserSlice = {
  item: null,
  isLoading: false,
  isError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.item = payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
