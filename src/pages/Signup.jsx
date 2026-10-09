import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardContent, FormControl, InputLabel,
  MenuItem, Select, Stack, TextField, Typography
} from "@mui/material";
import { STORAGE_KEYS } from "../constants";
import { readStorage, writeStorage } from "../utils/storage";
import { hashPassword } from "../utils/auth";

export default function Signup() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", role: "user"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const users = readStorage(STORAGE_KEYS.USERS, []);
    if (users.some((item) => item.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setError("An account with this email already exists.");
      return;
    }

    const { hash, salt } = await hashPassword(form.password);
    users.push({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      passwordHash: hash,
      passwordSalt: salt
    });

    writeStorage(STORAGE_KEYS.USERS, users);
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 500 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" gutterBottom>Create account</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Choose User or Admin access for the assignment.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Full name" value={form.name} onChange={update("name")} required fullWidth />
              <TextField label="Email" type="email" value={form.email} onChange={update("email")} required fullWidth />
              <TextField label="Password" type="password" value={form.password} onChange={update("password")} required fullWidth />
              <TextField label="Confirm password" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} required fullWidth />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select label="Role" value={form.role} onChange={update("role")}>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" size="large">Sign up</Button>
              <Button component={Link} to="/login">Already have an account? Login</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
