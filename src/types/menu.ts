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

export interface CreateNewMenuOption extends BaseOptions {
  name: string;
  price: number;
  assetUrl?: string;
  menuCategoryIds: number[];
}

export interface UpdateMenuOption extends BaseOptions {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  locationId: number;
  menuCategoryIds: number[];
}
export interface DeleteMenuOption extends BaseOptions {
  id: number;
}
