import {
  CreateOrderOptions,
  OrderSlice,
  RefreshOrderOptions,
  UpdateOrderOptions,
} from "@/types/order";
import { config } from "@/utils/config";
import { Order } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: OrderSlice = {
  items: [],
  isLoading: false,
  isError: null,
};
export const createOrderThunk = createAsyncThunk(
  "order/createOrder ",
  async (options: CreateOrderOptions, thunkApi) => {
    const { tableId, cartItems, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.backOfficeApiUrl}/order`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tableId, cartItems }),
      });
      const { orders } = await response.json();
      thunkApi.dispatch(setOrders(orders));
      onSuccess && onSuccess(orders);
    } catch (err) {
      console.log(err);
      onError && onError();
    }
  }
);
export const updateOrderThunk = createAsyncThunk(
  "order/updateOrder",
  async (options: UpdateOrderOptions, thunkApi) => {
    const { itemId, status, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.backOfficeApiUrl}/order?itemId=${itemId}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const { orders } = await response.json();
      thunkApi.dispatch(setOrders(orders));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);
export const refreshOrderThunk = createAsyncThunk(
  "order/updateOrder",
  async (options: RefreshOrderOptions, thunkApi) => {
    const { orderSeq, onSuccess, onError } = options;
    try {
      const response = await fetch(
        `${config.backOfficeApiUrl}/order?orderSeq=${orderSeq}`
      );
      const { orders } = await response.json();
      thunkApi.dispatch(setOrders(orders));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, { payload }: PayloadAction<Order[]>) => {
      state.items = payload;
    },
  },
});

export const { setOrders } = orderSlice.actions;
export default orderSlice.reducer;
