import {
  CreateNewLocationOptions,
  DeleteLocationOptions,
  LocationSlice,
  UpdateLocationOptions,
} from "@/types/location";
import { config } from "@/utils/config";
import { Location } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: LocationSlice = {
  items: [],
  selectedLocation: null,
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
export const updateLocationThunk = createAsyncThunk(
  "locations/updateLocation",
  async (options: UpdateLocationOptions, thunkApi) => {
    const { id, name, address, companyId, onSuccess, onError } = options;
    try {
      const response = await fetch(`${config.apiBaseUrl}/location`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, name, address, companyId }),
      });
      const { location } = await response.json();
      thunkApi.dispatch(replaceLocation(location));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);
export const deleteLocationThunk = createAsyncThunk(
  "delete/deleteLocation",
  async (options: DeleteLocationOptions, thunkApi) => {
    const { id, onSuccess, onError } = options;
    try {
      await fetch(`${config.apiBaseUrl}/location?id=${id}`, {
        method: "DELETE",
      });
      thunkApi.dispatch(removeLocation({ id }));
      onSuccess && onSuccess();
    } catch (error) {
      onError && onError();
    }
  }
);

const locationSlice = createSlice({
  name: "locationSlice",
  initialState,
  reducers: {
    setLocations: (state, { payload }: PayloadAction<Location[]>) => {
      state.items = payload;
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (!selectedLocationId) {
        const firstLocationId = payload[0].id;
        localStorage.setItem("selectedLocationId", String(firstLocationId));
        state.selectedLocation = payload[0];
      } else {
        const selectedLocation = state.items.find(
          (item) => item.id === Number(selectedLocationId)
        );
        if (selectedLocation) {
          state.selectedLocation = selectedLocation;
        }
      }
    },
    addLocation: (state, { payload }) => {
      state.items = [...state.items, payload];
    },
    replaceLocation: (state, { payload }: PayloadAction<Location>) => {
      state.items = state.items.filter((item) =>
        item.id === payload.id ? payload : item
      );
    },
    setSelectedLocation: (state, { payload }: PayloadAction<Location>) => {
      state.selectedLocation = payload;
    },
    removeLocation: (state, { payload }: PayloadAction<{ id: number }>) => {
      state.items = state.items.filter((item) => item.id !== payload.id);
    },
  },
});

export const {
  setLocations,
  addLocation,
  replaceLocation,
  removeLocation,
  setSelectedLocation,
} = locationSlice.actions;
export default locationSlice.reducer;
