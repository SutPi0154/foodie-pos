import { Addon } from "@prisma/client";

export interface AddonSlice {
  items: Addon[];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
