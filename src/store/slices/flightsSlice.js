import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_FLIGHTS, STORAGE_KEYS } from "../../constants";
import { readStorage, writeStorage } from "../../utils/storage";

const initialFlights = readStorage(STORAGE_KEYS.FLIGHTS, null) || DEFAULT_FLIGHTS;

const persist = (flights) => writeStorage(STORAGE_KEYS.FLIGHTS, flights);

const flightsSlice = createSlice({
  name: "flights",
  initialState: {
    items: initialFlights
  },
  reducers: {
    addFlight: (state, action) => {
      state.items.push(action.payload);
      persist(state.items);
    },
    updateFlight: (state, action) => {
      const index = state.items.findIndex((flight) => flight.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        persist(state.items);
      }
    },
    deleteFlight: (state, action) => {
      state.items = state.items.filter((flight) => flight.id !== action.payload);
      persist(state.items);
    },
    reserveSeat: (state, action) => {
      const flight = state.items.find((item) => item.id === action.payload);
      if (flight && flight.bookedSeats < flight.totalSeats) {
        flight.bookedSeats += 1;
        persist(state.items);
      }
    }
  }
});

export const { addFlight, updateFlight, deleteFlight, reserveSeat } = flightsSlice.actions;
export default flightsSlice.reducer;
