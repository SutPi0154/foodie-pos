import { BaseOptions } from "./app";

export interface UserSlice extends BaseOptions {
  item: User | null;
  isLoading: boolean;
  isError: Error | null;
}
interface User {
  id: number;
  email: string;
  name: string;
  companyId: number;
}
