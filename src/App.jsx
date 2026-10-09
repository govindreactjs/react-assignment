import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useInactivityLogout } from "./hooks/useInactivityLogout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SearchFlights from "./pages/SearchFlights";
import BookingDetails from "./pages/BookingDetails";
import Confirmation from "./pages/Confirmation";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  useInactivityLogout(isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/search" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/search" element={<SearchFlights />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["user"]} />}>
        <Route element={<Layout />}>
          <Route path="/booking/:flightId" element={<BookingDetails />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
