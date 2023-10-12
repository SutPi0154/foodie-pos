export interface MenuSlice {
  items: [];
  isLoading: boolean;
  error: Error | null;
}

export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (data?: any) => void;
}
export interface GetMenusOptions extends BaseOptions {
  locationId: string;
}
