import { disabledLocationMenuCategory } from "@prisma/client";
import { BaseOptions } from "./app";

export interface DisableLocationMenuCategorySlice {
  items: disabledLocationMenuCategory[];
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
  isAvailable: boolean;
}
export interface DeleteMenuCategoryOption extends BaseOptions {
  id: number;
}
