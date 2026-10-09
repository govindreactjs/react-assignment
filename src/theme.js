import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1565c0" },
    secondary: { main: "#7b1fa2" },
    background: { default: "#f5f7fb", paper: "#ffffff" }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 }
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true }
    },
    MuiCard: {
      styleOverrides: {
        root: { border: "1px solid rgba(0,0,0,0.08)" }
      }
    },
    MuiTextField: {
      defaultProps: { size: "small" }
    },
    MuiFormControl: {
      defaultProps: { size: "small" }
    }
  }
});

export default theme;
