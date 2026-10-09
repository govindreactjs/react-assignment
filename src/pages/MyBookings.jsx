import { useSelector } from "react-redux";
import {
  Card, CardContent, Chip, Stack, Typography, Box
} from "@mui/material";

export default function MyBookings() {
  const { user } = useSelector((state) => state.auth);
  const bookings = useSelector((state) =>
    state.bookings.items.filter((booking) => booking.userId === user.id)
  );

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">My Bookings</Typography>
        <Typography color="text.secondary">Your confirmed flight bookings.</Typography>
      </Box>

      {bookings.length === 0 && (
        <Card><CardContent><Typography>No bookings found.</Typography></CardContent></Card>
      )}

      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardContent>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr auto" }, gap: 2, alignItems: "center" }}>
              <Box>
                <Typography variant="h6">{booking.flight.airline}</Typography>
                <Typography>{booking.flight.from} → {booking.flight.to}</Typography>
                <Typography variant="body2" color="text.secondary">{booking.flight.flightNumber}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Booking ID</Typography>
                <Typography>{booking.id}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Passenger</Typography>
                <Typography>{booking.passenger.name}</Typography>
              </Box>
              <Chip label={booking.status} color="success" />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
