import { Table } from "@prisma/client";
import { BaseOptions } from "./app";

export interface TableSlice {
  items: Table[];
  isLoading: boolean;
  isError: Error | null;
}

export interface UpdateTableOption extends BaseOptions {
  id: number;
  name: string;
  locationId?: number;
}

export interface DeleteTableOption extends BaseOptions {
  id: number;
}
export interface CreateTableOptions extends BaseOptions {
  name: string;
  locationId?: number;
}
