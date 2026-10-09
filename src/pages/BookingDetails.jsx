import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardContent, Divider, FormControl,
  InputLabel, MenuItem, Select, Stack, TextField, Typography
} from "@mui/material";
import { addBooking } from "../store/slices/bookingsSlice";
import { reserveSeat } from "../store/slices/flightsSlice";

export default function BookingDetails() {
  const { flightId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const storedFlight = useSelector((state) => state.flights.items.find((item) => item.id === flightId));
  const flight = location.state?.flight || storedFlight;

  const [passenger, setPassenger] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    passengers: 1,
    paymentMode: "card"
  });
  const [paymentState, setPaymentState] = useState("idle");
  const [error, setError] = useState("");

  const total = useMemo(() => Number(flight?.price || 0) * Number(passenger.passengers || 1), [flight, passenger.passengers]);

  if (!flight) {
    return <Alert severity="error">Flight details could not be found.</Alert>;
  }

  const availableSeats = flight.totalSeats - flight.bookedSeats;

  const update = (field) => (event) => {
    setPassenger((current) => ({ ...current, [field]: event.target.value }));
  };

  const handlePayment = async () => {
    setError("");

    if (!passenger.name || !passenger.email || !passenger.phone) {
      setError("Please complete all passenger details.");
      return;
    }

    if (Number(passenger.passengers) > availableSeats) {
      setError(`Only ${availableSeats} seat(s) are available.`);
      return;
    }

    setPaymentState("processing");
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (passenger.phone.endsWith("0000")) {
      setPaymentState("failed");
      setError("Payment failed in the demo gateway. Please try again.");
      return;
    }

    const booking = {
      id: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      userName: user.name,
      passenger,
      flight,
      total,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };

    dispatch(addBooking(booking));
    if (storedFlight) {
      for (let i = 0; i < Number(passenger.passengers); i += 1) {
        dispatch(reserveSeat(flight.id));
      }
    }

    setPaymentState("success");
    navigate("/confirmation", { state: { booking } });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Booking Details</Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">{flight.airline} • {flight.flightNumber}</Typography>
          <Typography color="text.secondary">
            {flight.from} → {flight.to} • {flight.departureTime} - {flight.arrivalTime}
          </Typography>
          <Typography sx={{ mt: 1 }}>Available seats: <strong>{availableSeats}</strong></Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Passenger details</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <TextField label="Passenger name" value={passenger.name} onChange={update("name")} required />
            <TextField label="Email" type="email" value={passenger.email} onChange={update("email")} required />
            <TextField label="Phone" value={passenger.phone} onChange={update("phone")} required />
            <TextField label="Number of passengers" type="number" inputProps={{ min: 1, max: availableSeats }} value={passenger.passengers} onChange={update("passengers")} required />
            <FormControl>
              <InputLabel>Payment mode</InputLabel>
              <Select label="Payment mode" value={passenger.paymentMode} onChange={update("paymentMode")}>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="netbanking">Net Banking</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">Total price: ₹{total}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Demo payment: a phone number ending in 0000 simulates failure.
          </Typography>

          {error && <Alert severity={paymentState === "failed" ? "error" : "warning"} sx={{ mt: 2 }}>{error}</Alert>}

          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            onClick={handlePayment}
            disabled={paymentState === "processing"}
          >
            {paymentState === "processing" ? "Processing payment..." : `Pay ₹${total}`}
          </Button>
        </CardContent>
      </Card>
    </Stack>
  );
}
