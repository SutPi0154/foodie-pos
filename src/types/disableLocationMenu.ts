import { DisabledLocationMenu } from "@prisma/client";

export interface DisableLocationMenuSlice {
  items: DisabledLocationMenu[];
  isLoading: boolean;
  isError: Error | null;
}
