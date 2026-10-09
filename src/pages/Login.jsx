import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardContent, Divider, Stack, TextField,
  Typography
} from "@mui/material";
import { loginSuccess } from "../store/slices/authSlice";
import { STORAGE_KEYS } from "../constants";
import { readStorage } from "../utils/storage";
import { verifyPassword } from "../utils/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const users = readStorage(STORAGE_KEYS.USERS, []);
    const user = users.find(
      (item) => item.email.toLowerCase() === form.email.trim().toLowerCase()
    );

    if (!user || !(await verifyPassword(form.password, user.passwordHash, user.passwordSalt))) {
      setError("Invalid email or password.");
      return;
    }

    dispatch(loginSuccess({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }));

    const destination = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/search");
    navigate(destination, { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 460 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" gutterBottom>Welcome back</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in to Flight Explorer.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" value={form.email} onChange={update("email")} required fullWidth />
              <TextField label="Password" type="password" value={form.password} onChange={update("password")} required fullWidth />
              <Button type="submit" variant="contained" size="large">Login</Button>
              <Divider>OR</Divider>
              <Button component={Link} to="/signup" variant="outlined">Create account</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
