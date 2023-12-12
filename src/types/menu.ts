import { Menu } from "@prisma/client";
import { BaseOptions } from "./app";

export interface MenuSlice {
  items: Menu[];
  isLoading: boolean;
  isError: Error | null;
}

export interface GetMenusOptions extends BaseOptions {
  locationId: string;
}

export interface CreateNewMenuOptions extends BaseOptions {
  name: string;
  price: number;
  assetUrl?: string;
  menuCategoryIds: number[];
}

export interface UpdateMenuOptions extends BaseOptions {
  id: number;
  name: string;
  price: number;
  isAvailable?: boolean;
  locationId: number;
  menuCategoryIds: number[];
  assetUrl?: string | null;
}
export interface DeleteMenuOptions extends BaseOptions {
  id: number;
}
