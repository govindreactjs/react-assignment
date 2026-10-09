import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert, Button, Card, CardContent, Divider, Stack, Typography
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  if (!booking) {
    return <Alert severity="warning">Booking confirmation is not available in this session.</Alert>;
  }

  return (
    <Card sx={{ maxWidth: 720, mx: "auto" }}>
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
          <Typography variant="h4">Booking Confirmed</Typography>
          <Typography color="text.secondary">Your flight booking has been successfully created.</Typography>
          <Divider sx={{ width: "100%" }} />
          <Typography><strong>Booking ID:</strong> {booking.id}</Typography>
          <Typography><strong>Route:</strong> {booking.flight.from} → {booking.flight.to}</Typography>
          <Typography><strong>Passenger:</strong> {booking.passenger.name}</Typography>
          <Typography><strong>Total:</strong> ₹{booking.total}</Typography>
          <Button variant="contained" onClick={() => navigate("/bookings")}>View My Bookings</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
