import { CartItem } from "@/types/cart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CartSLice {
  isLoading: boolean;
  items: CartItem[];
  isError: Error | null;
}
const initialState: CartSLice = {
  isLoading: false,
  items: [],
  isError: null,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart: (state, { payload }: PayloadAction<CartItem>) => {
      state.items = [...state.items, payload];
    },
    removeCart: (state, { payload }: PayloadAction<CartItem>) => {
      state.items = state.items.filter((item) => item.id !== payload.id);
    },
    emptyCart: (state) => {
      state.items = [];
    },
  },
});

export const { addCart, removeCart, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
