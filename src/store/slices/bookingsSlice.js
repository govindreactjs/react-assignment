import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../constants";
import { readStorage, writeStorage } from "../../utils/storage";

const initialBookings = readStorage(STORAGE_KEYS.BOOKINGS, []);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    items: initialBookings
  },
  reducers: {
    addBooking: (state, action) => {
      state.items.push(action.payload);
      writeStorage(STORAGE_KEYS.BOOKINGS, state.items);
    }
  }
});

export const { addBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
