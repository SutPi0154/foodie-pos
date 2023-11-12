import { DisabledLocationMenuCategory } from "@prisma/client";

export interface DisableLocationMenuCategorySlice {
  items: DisabledLocationMenuCategory[];
  isLoading: boolean;
  isError: Error | null;
}
