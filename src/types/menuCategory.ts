import { MenuCategory } from "@prisma/client";
import { BaseOptions } from "./app";

export interface MenuCategorySlice {
  items: MenuCategory[];
  isLoading: boolean;
  isError: Error | null;
}

export interface CreateMenuCategoryOptions extends BaseOptions {
  name: string;
  locationId?: number;
}

export interface UpdateMenuCategoryOptions extends BaseOptions {
  id: number;
  name: string;
  companyId?: number;
}
export interface DeleteMenuCategoryOption extends BaseOptions {
  id: number;
}
