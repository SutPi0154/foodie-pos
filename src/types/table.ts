import { Table } from "@prisma/client";

export interface TableSlice {
  items: Table[];
  isLoading: boolean;
  isError: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
