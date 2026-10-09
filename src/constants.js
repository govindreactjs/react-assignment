export const STORAGE_KEYS = {
  USERS: "flight_explorer_users",
  SESSION: "flight_explorer_session",
  FLIGHTS: "flight_explorer_flights",
  BOOKINGS: "flight_explorer_bookings"
};

export const DEFAULT_FLIGHTS = [
  {
    id: "FL-PNQ-BOM-001",
    flightNumber: "FE101",
    airline: "Flight Explorer Air",
    from: "PNQ",
    to: "BOM",
    departureTime: "08:30",
    arrivalTime: "09:45",
    date: "2026-10-15",
    price: 4500,
    totalSeats: 50,
    bookedSeats: 12,
    stops: 0
  }
];

export const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "Night"];
export const STOP_OPTIONS = ["Non-stop", "1-stop", "2+ stops"];
