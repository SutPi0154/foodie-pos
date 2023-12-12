import { Addon, Menu, ORDERSTATUS, Order, Table } from "@prisma/client";
import { BaseOptions } from "./app";
import { CartItem } from "./cart";

export interface OrderSlice {
  items: Order[];
  isLoading: boolean;
  isError: Error | null;
}

export interface CreateOrderOptions extends BaseOptions {
  tableId: number;
  cartItems: CartItem[];
}
export interface UpdateOrderOptions extends BaseOptions {
  itemId: string;
  status: ORDERSTATUS;
}
export interface RefreshOrderOptions extends BaseOptions {
  orderSeq: string;
}
export interface orderAddon {
  addonCategoryId: number;
  addons: Addon[];
}

export interface OrderItem {
  itemId: string;
  status: ORDERSTATUS;
  orderAddons: orderAddon[];
  menu: Menu;
  table: Table;
}
