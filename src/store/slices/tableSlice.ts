import {
  CreateTableOptions,
  DeleteTableOption,
  TableSlice,
  UpdateTableOption,
} from "@/types/table";
import { config } from "@/utils/config";
import { Table } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: TableSlice = {
  items: [],
  isLoading: false,
  isError: null,
};
export const createTableThunk = createAsyncThunk(
  "tables/createTable",
  async (options: CreateTableOptions, thunkApi) => {
    const { name, locationId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/table`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, locationId }),
      });
      const { table } = await response.json();
      thunkApi.dispatch(addTable(table));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const updateTableThunk = createAsyncThunk(
  "table/updateTable",
  async (options: UpdateTableOption, thunkApi) => {
    const { id, name, locationId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/table`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, locationId }),
      });
      const { table } = await response.json();
      replaceTable(table);
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);
export const deleteTableThunk = createAsyncThunk(
  "tables/deleteTable",
  async (options: DeleteTableOption, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/table?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeTable({ id }));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTables: (state, { payload }) => {
      state.items = payload;
    },
    replaceTable: (state, { payload }: PayloadAction<Table>) => {
      state.items = state.items.map((item) =>
        item.id === payload.id ? payload : item
      );
    },
    addTable: (state, { payload }: PayloadAction<Table>) => {
      state.items = [...state.items, payload];
    },
    removeTable: (state, { payload }: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== payload.id);
    },
  },
});

export const { setTables, removeTable, addTable, replaceTable } =
  tableSlice.actions;
export default tableSlice.reducer;
