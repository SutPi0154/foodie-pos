import { Location } from "@prisma/client";
import { BaseOptions } from "./app";

export interface LocationSlice {
  items: Location[];
  isLoading: boolean;
  selectedLocation: Location | null;
  isError: Error | null;
}

export interface CreateNewLocationOptions extends BaseOptions {
  name: string;
  street: string;
  city: string;
  township: string;
}

export interface UpdateLocationOptions extends BaseOptions {
  id: number;
  name: string;
  street: string;
  city: string;
  township: string;
  companyId: number;
}
export interface DeleteLocationOptions extends BaseOptions {
  id: number;
}
