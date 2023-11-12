import { Addon } from "@prisma/client";
import { BaseOptions } from "./app";

export interface AddonSlice {
  items: Addon[];
  isLoading: boolean;
  isError: Error | null;
}

export interface UpdateAddonOption extends BaseOptions {
  id: number;
  name: string;
  price: number;
  addonCategoryId: number;
}

export interface DeleteAddonOption extends BaseOptions {
  id: number;
}
export interface CreateAddonOptions extends BaseOptions {
  name: string;
  price: number;
  addonCategoryId?: number;
}
