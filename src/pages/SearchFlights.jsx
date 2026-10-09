import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardContent, Chip, FormControl, InputLabel,
  MenuItem, Select, Slider, Stack, Tab, Tabs, TextField, Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { searchFlights } from "../services/aviationStack";
import { STOP_OPTIONS, TIME_SLOTS } from "../constants";

const emptyLeg = { from: "PNQ", to: "BOM", date: "2026-10-15" };

const getTimeSlot = (time) => {
  const hour = Number(String(time || "00:00").split(":")[0]);
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};

export default function SearchFlights() {
  const [tripType, setTripType] = useState("one-way");
  const [legs, setLegs] = useState([{ ...emptyLeg }]);
  const [returnDate, setReturnDate] = useState("2026-10-20");
  const [filters, setFilters] = useState({
    price: [0, 20000],
    airline: "All",
    stops: "All",
    departureSlot: "All",
    arrivalSlot: "All"
  });
  const [results, setResults] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const currentLegs = useMemo(() => {
    if (tripType === "one-way") return legs.slice(0, 1);
    if (tripType === "round-trip") {
      return [
        legs[0],
        { from: legs[0].to, to: legs[0].from, date: returnDate }
      ];
    }
    return legs.slice(0, 3);
  }, [legs, returnDate, tripType]);

  const updateLeg = (index, field) => (event) => {
    const value = event.target.value;
    setLegs((current) => current.map((leg, i) => i === index ? { ...leg, [field]: value } : leg));
  };

  const addCity = () => {
    if (legs.length < 3) setLegs((current) => [...current, { from: "", to: "", date: "2026-10-20" }]);
  };

  const removeCity = (index) => {
    setLegs((current) => current.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    setError("");
    const valid = currentLegs.every((leg) => leg.from && leg.to && leg.date && leg.from !== leg.to);
    if (!valid) {
      setError("Please enter valid origin, destination and date for every route.");
      return;
    }

    setLoading(true);
    try {
      const data = await searchFlights(currentLegs);
      setResults(data);
      setAirlines([...new Set(data.map((item) => item.airline))]);
    } catch (err) {
      setResults([]);
      setError(err?.response?.data?.error?.message || err.message || "Unable to fetch flights.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = results.filter((flight) => {
    const priceOk = flight.price >= filters.price[0] && flight.price <= filters.price[1];
    const airlineOk = filters.airline === "All" || flight.airline === filters.airline;
    const stopsOk =
      filters.stops === "All" ||
      (filters.stops === "Non-stop" && flight.stops === 0) ||
      (filters.stops === "1-stop" && flight.stops === 1) ||
      (filters.stops === "2+ stops" && flight.stops >= 2);
    const departureOk = filters.departureSlot === "All" || getTimeSlot(flight.departureTime) === filters.departureSlot;
    const arrivalOk = filters.arrivalSlot === "All" || getTimeSlot(flight.arrivalTime) === filters.arrivalSlot;
    return priceOk && airlineOk && stopsOk && departureOk && arrivalOk;
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Search Flights</Typography>
        <Typography color="text.secondary">Find flights using AviationStack and refine the results.</Typography>
      </Box>

      <Card>
        <CardContent>
          <Tabs value={tripType} onChange={(_, value) => {
            setTripType(value);
            setLegs((current) => value === "multi-city" ? [...current.slice(0, 3)] : [{ ...current[0] }]);
          }} sx={{ mb: 3 }}>
            <Tab value="one-way" label="One-way" />
            <Tab value="round-trip" label="Round-trip" />
            <Tab value="multi-city" label="Multi-city" />
          </Tabs>

          <Stack spacing={2}>
            {currentLegs.map((leg, index) => (
              <Box
                key={`${index}-${tripType}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr) auto" },
                  gap: 2,
                  alignItems: "center"
                }}
              >
                <TextField label={`From ${index + 1}`} value={leg.from} onChange={updateLeg(index, "from")} placeholder="PNQ" />
                <TextField label={`To ${index + 1}`} value={leg.to} onChange={updateLeg(index, "to")} placeholder="BOM" />
                <TextField label={tripType === "round-trip" && index === 1 ? "Return date" : "Date"} type="date" value={leg.date} onChange={updateLeg(index, "date")} InputLabelProps={{ shrink: true }} />
                {tripType === "multi-city" && currentLegs.length > 1 && (
                  <Button color="error" onClick={() => removeCity(index)}>Remove</Button>
                )}
              </Box>
            ))}

            {tripType === "round-trip" && (
              <TextField
                label="Return date"
                type="date"
                value={returnDate}
                onChange={(event) => setReturnDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: 300 }}
              />
            )}

            {tripType === "multi-city" && legs.length < 3 && (
              <Button variant="outlined" onClick={addCity}>Add destination</Button>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search flights"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Advanced Filters</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.5fr repeat(4, 1fr)" }, gap: 2, alignItems: "center" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Price: ₹{filters.price[0]} - ₹{filters.price[1]}</Typography>
                <Slider
                  value={filters.price}
                  min={0}
                  max={20000}
                  step={500}
                  onChange={(_, value) => setFilters((f) => ({ ...f, price: value }))}
                  valueLabelDisplay="auto"
                />
              </Box>

              <FormControl>
                <InputLabel>Airline</InputLabel>
                <Select label="Airline" value={filters.airline} onChange={(e) => setFilters((f) => ({ ...f, airline: e.target.value }))}>
                  <MenuItem value="All">All</MenuItem>
                  {airlines.map((airline) => <MenuItem key={airline} value={airline}>{airline}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Stops</InputLabel>
                <Select label="Stops" value={filters.stops} onChange={(e) => setFilters((f) => ({ ...f, stops: e.target.value }))}>
                  <MenuItem value="All">All</MenuItem>
                  {STOP_OPTIONS.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Departure</InputLabel>
                <Select label="Departure" value={filters.departureSlot} onChange={(e) => setFilters((f) => ({ ...f, departureSlot: e.target.value }))}>
                  <MenuItem value="All">All</MenuItem>
                  {TIME_SLOTS.map((slot) => <MenuItem key={slot} value={slot}>{slot}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Arrival</InputLabel>
                <Select label="Arrival" value={filters.arrivalSlot} onChange={(e) => setFilters((f) => ({ ...f, arrivalSlot: e.target.value }))}>
                  <MenuItem value="All">All</MenuItem>
                  {TIME_SLOTS.map((slot) => <MenuItem key={slot} value={slot}>{slot}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
      )}

      <Stack spacing={2}>
        {results.length > 0 && <Typography variant="h5">{filtered.length} flight(s) found</Typography>}
        {filtered.map((flight) => (
          <Card key={flight.id}>
            <CardContent>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr auto" }, gap: 2, alignItems: "center" }}>
                <Box>
                  <Typography variant="h6">{flight.airline}</Typography>
                  <Typography color="text.secondary">{flight.flightNumber}</Typography>
                </Box>
                <Box>
                  <Typography>{flight.from} → {flight.to}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.departureTime} - {flight.arrivalTime}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip size="small" label={flight.stops === 0 ? "Non-stop" : `${flight.stops} stop(s)`} />
                  <Chip size="small" label={`₹${flight.price}`} color="primary" />
                </Stack>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/booking/${encodeURIComponent(flight.id)}`, { state: { flight } })}
                >
                  Select
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
