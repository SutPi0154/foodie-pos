import { MenuAddonCategory } from "@prisma/client";

export interface MenuAddonCategorySlice {
  items: MenuAddonCategory[];
  isLoading: boolean;
  isError: Error | null;
}
