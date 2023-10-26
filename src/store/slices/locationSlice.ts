import { CreateNewLocationOptions, LocationSlice } from "@/types/location";
import { config } from "@/utils/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: LocationSlice = {
  items: [],
  isLoading: false,
  isError: null,
};
export const createNewLocation = createAsyncThunk(
  "location/createLocation",
  async (options: CreateNewLocationOptions, thunkApi) => {
    const { name, address, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/location`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, address }),
      });
      const newLocation = await response.json();
      thunkApi.dispatch(addLocation(newLocation));
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError();
    }
  }
);

const locationSlice = createSlice({
  name: "locationSlice",
  initialState,
  reducers: {
    setLocations: (state, { payload }) => {
      state.items = payload;
    },
    addLocation: (state, { payload }) => {
      state.items = [...state.items, payload];
    },
  },
});

export const { setLocations, addLocation } = locationSlice.actions;
export default locationSlice.reducer;
