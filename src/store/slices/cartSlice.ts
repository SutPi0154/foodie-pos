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
    addToCart: (state, { payload }: PayloadAction<CartItem>) => {
      const exist = state.items.find((item) => item.id === payload.id);
      if (exist) {
        state.items = state.items.map((item) =>
          item.id === payload.id ? payload : item
        );
      } else {
        state.items = [...state.items, payload];
      }
    },
    removeFromCart: (state, { payload }: PayloadAction<CartItem>) => {
      state.items = state.items.filter((item) => item.id !== payload.id);
    },
    emptyCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
