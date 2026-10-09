import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert, Box, Button, Card, CardContent, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, InputAdornment, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { addFlight, deleteFlight, updateFlight } from "../store/slices/flightsSlice";

const emptyFlight = {
  id: "",
  flightNumber: "",
  airline: "",
  from: "",
  to: "",
  departureTime: "08:00",
  arrivalTime: "10:00",
  date: "2026-10-15",
  price: 4500,
  totalSeats: 50,
  bookedSeats: 0,
  stops: 0
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const flights = useSelector((state) => state.flights.items);
  const bookings = useSelector((state) => state.bookings.items);
  const [flightForm, setFlightForm] = useState(emptyFlight);
  const [editing, setEditing] = useState(false);
  const [flightDialog, setFlightDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [error, setError] = useState("");

  const filteredBookings = useMemo(() => {
    const q = bookingSearch.toLowerCase().trim();
    if (!q) return bookings;
    return bookings.filter((booking) =>
      [booking.id, booking.userName, booking.passenger?.name, booking.flight?.flightNumber]
        .some((value) => String(value || "").toLowerCase().includes(q))
    );
  }, [bookingSearch, bookings]);

  const filteredFlights = flights.filter((flight) =>
    [flight.flightNumber, flight.airline, flight.from, flight.to]
      .some((value) => String(value || "").toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditing(false);
    setError("");
    setFlightForm({ ...emptyFlight, id: `FL-${Date.now()}` });
    setFlightDialog(true);
  };

  const openEdit = (flight) => {
    setEditing(true);
    setError("");
    setFlightForm({ ...flight });
    setFlightDialog(true);
  };

  const update = (field) => (event) => {
    setFlightForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const saveFlight = (event) => {
    event.preventDefault();
    setError("");

    if (!flightForm.flightNumber || !flightForm.airline || !flightForm.from || !flightForm.to) {
      setError("Please complete the required flight fields.");
      return;
    }

    const normalized = {
      ...flightForm,
      price: Number(flightForm.price),
      totalSeats: Number(flightForm.totalSeats),
      bookedSeats: Number(flightForm.bookedSeats),
      stops: Number(flightForm.stops)
    };

    if (editing) dispatch(updateFlight(normalized));
    else dispatch(addFlight(normalized));

    setFlightDialog(false);
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Typography color="text.secondary">Manage flights and view all user bookings.</Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}>
            <Typography variant="h5">Flights</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add flight</Button>
          </Stack>

          <TextField
            sx={{ mt: 2, mb: 2, width: { xs: "100%", md: 400 } }}
            placeholder="Search flights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Flight</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Seats</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFlights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell>{flight.flightNumber}<br />{flight.airline}</TableCell>
                    <TableCell>{flight.from} → {flight.to}</TableCell>
                    <TableCell>₹{flight.price}</TableCell>
                    <TableCell>{flight.bookedSeats}/{flight.totalSeats}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => openEdit(flight)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => setDeleteId(flight.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>All User Bookings</Typography>
          <TextField
            sx={{ mb: 2, width: { xs: "100%", md: 400 } }}
            placeholder="Search by booking, user, passenger or flight..."
            value={bookingSearch}
            onChange={(e) => setBookingSearch(e.target.value)}
          />
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Flight</TableCell>
                  <TableCell>Passenger</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.flight.flightNumber} ({booking.flight.from} → {booking.flight.to})</TableCell>
                    <TableCell>{booking.passenger.name}</TableCell>
                    <TableCell>₹{booking.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={flightDialog} onClose={() => setFlightDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing ? "Edit flight" : "Add flight"}</DialogTitle>
        <Box component="form" onSubmit={saveFlight}>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField label="Flight number" value={flightForm.flightNumber} onChange={update("flightNumber")} required />
                <TextField label="Airline" value={flightForm.airline} onChange={update("airline")} required />
                <TextField label="From" value={flightForm.from} onChange={update("from")} required />
                <TextField label="To" value={flightForm.to} onChange={update("to")} required />
                <TextField label="Date" type="date" value={flightForm.date} onChange={update("date")} InputLabelProps={{ shrink: true }} />
                <TextField label="Price" type="number" value={flightForm.price} onChange={update("price")} />
                <TextField label="Departure time" type="time" value={flightForm.departureTime} onChange={update("departureTime")} InputLabelProps={{ shrink: true }} />
                <TextField label="Arrival time" type="time" value={flightForm.arrivalTime} onChange={update("arrivalTime")} InputLabelProps={{ shrink: true }} />
                <TextField label="Total seats" type="number" value={flightForm.totalSeats} onChange={update("totalSeats")} />
                <TextField label="Booked seats" type="number" value={flightForm.bookedSeats} onChange={update("bookedSeats")} />
                <TextField label="Stops" type="number" value={flightForm.stops} onChange={update("stops")} inputProps={{ min: 0 }} />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFlightDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editing ? "Save changes" : "Add flight"}</Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete flight?</DialogTitle>
        <DialogContent>
          <Typography>This action will remove the flight from local persistence.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => {
            dispatch(deleteFlight(deleteId));
            setDeleteId(null);
          }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
