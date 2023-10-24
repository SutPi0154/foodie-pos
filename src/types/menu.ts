import { Menu } from "@prisma/client";

export interface MenuSlice {
  items: Menu[];
  isLoading: boolean;
  error: Error | null;
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
