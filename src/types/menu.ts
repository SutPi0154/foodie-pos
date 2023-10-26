import { Menu } from "@prisma/client";

export interface MenuSlice {
  items: Menu[];
  isLoading: boolean;
  isError: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
export interface GetMenusOptions extends BaseOptions {
  locationId: string;
}

export interface CreateNewMenuOption extends BaseOptions {
  name: string;
  price: number;
  menuCategoryIds: number[];
}

export interface UpdateMenuOption extends BaseOptions {
  id: number;
  name: string;
  price: number;
  menuCategoryIds: number[];
}
export interface DeleteMenuOption extends BaseOptions {
  id: number;
}
