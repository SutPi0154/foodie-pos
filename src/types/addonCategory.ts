import { AddonCategory } from "@prisma/client";
import { BaseOptions } from "./app";

export interface AddonCategorySlice {
  items: AddonCategory[];
  isLoading: boolean;
  isError: Error | null;
}

export interface CreateAddonCategoryOptions extends BaseOptions {
  name: string;
  isRequired: boolean;
  menuIds: number[];
}
export interface UpdateAddonCategoryOption extends BaseOptions {
  id: number;
  name: string;
  isRequired: boolean;
  menuIds: number[];
}

export interface DeleteAddonCategoryOption extends BaseOptions {
  id: number;
}
