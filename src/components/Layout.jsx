import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, Box, Container, IconButton,
  Drawer, List, ListItemButton, ListItemText, Stack, Chip
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { logout } from "../store/slices/authSlice";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const links = user?.role === "admin"
    ? [{ label: "Admin Dashboard", to: "/admin" }]
    : [
      { label: "Search Flights", to: "/search" },
      { label: "My Bookings", to: "/bookings" }
    ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const navigation = (
    <Stack direction="row" spacing={1} alignItems="center">
      {links.map((link) => (
        <Button key={link.to} component={Link} to={link.to} color="inherit">
          {link.label}
        </Button>
      ))}
      <Chip
        label={`${user?.name || "User"} • ${user?.role}`}
        variant="outlined"
        sx={{ color: "inherit", borderColor: "rgba(255,255,255,.5)" }}
      />
      <Button color="inherit" onClick={handleLogout}>Logout</Button>
    </Stack>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <FlightTakeoffIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to={user?.role === "admin" ? "/admin" : "/search"}
            color="inherit"
            sx={{ textDecoration: "none", fontWeight: 800, flexGrow: 1 }}
          >
            Flight Explorer
          </Typography>
          <Box sx={{ display: { xs: "none", md: "block" } }}>{navigation}</Box>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280 }} role="presentation">
          <List>
            {links.map((link) => (
              <ListItemButton
                key={link.to}
                component={Link}
                to={link.to}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Outlet />
      </Container>
    </>
  );
}
