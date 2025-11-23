import React, { useState } from "react";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Fade,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

// ⭐ YOUR CUSTOM THEME
const theme = createTheme({
  palette: {
    primary: { main: "#48a4b0ff" }, // teal
    secondary: { main: "#0A6C91" }, // deep blue
    accent: { main: "#4FD1C5" },    // mint
    background: { default: "#F4F8F9" },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
  },
  typography: {
    fontFamily:
      '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  },
});

const departments = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "General Medicine",
];

const genders = ["Male", "Female", "Other", "Prefer not to say"];

const specializations = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "General Physician",
];

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    date: "",
    department: "",
    gender: "",
    time: "",
    symptoms: "",
    specialization: "",          // ✅ add this
  });

  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let message = "";

    if (!value && ["patientName", "phone", "email", "date", "time", "gender", "specialization", "department"].includes(name)) {
      message = "This field is required.";
    }

    if (name === "phone" && value && !/^\d{10}$/.test(value)) {
      message = "Enter a valid 10-digit phone number.";
    }

    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Enter a valid email.";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const validateForm = () => {
    return Object.keys(formData).every((field) =>
      validateField(field, formData[field])
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitState({
        open: true,
        message: "Please correct the highlighted fields.",
        severity: "error",
      });
      return;
    }

    setSubmitState({
      open: true,
      message: "Appointment submitted!",
      severity: "success",
    });

    setFormData({
      patientName: "",
      phone: "",
      email: "",
      date: "",
      department: "",
      gender: "",
      time: "",
      symptoms: "",
      specialization: "",
    });

    setErrors({});
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.pexels.com/photos/263337/pexels-photo-263337.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: 2,
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={700}>
            <Card
              sx={{
                bgcolor: "rgba(255,255,255,0.95)",
                borderRadius: 3,
                boxShadow: 8,
                p: 2,
              }}
            >
              <CardContent sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 } }}>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  Medical Appointment Form
                </Typography>

                <Typography
                  align="center"
                  sx={{ color: "text.secondary", mb: 4 }}
                >
                  Fill the details to book your appointment
                </Typography>

                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <Grid
                    container
                    rowSpacing={3}
                    columnSpacing={{ xs: 2, md: 3 }}
                    alignItems="center"
                    sx={{
                      "& .MuiGrid-item": { display: "flex" },     // ✅ grid item is flex
                      "& .MuiGrid-item > *": { flexGrow: 1 },     // ✅ child fills width
                    }}
                  >
                    {/* ---------- ROW 1 (4 x 3 = 12) ---------- */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        required
                        size="medium"
                        variant="outlined"
                        label="Patient Name"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        error={!!errors.patientName}
                        helperText={errors.patientName}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        required
                        size="medium"
                        variant="outlined"
                        type="date"
                        label="Select Date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        error={!!errors.date}
                        helperText={errors.date}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        required
                        size="medium"
                        variant="outlined"
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </Grid>

                    {/* DEPARTMENT */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        fullWidth
                        required
                        size="medium"
                        variant="outlined"
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        error={!!errors.department}
                        helperText={errors.department}
                      >
                        <MenuItem value="" disabled>
                          Select department
                        </MenuItem>
                        {departments.map((dep) => (
                          <MenuItem key={dep} value={dep}>
                            {dep}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* DEPARTMENT */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        fullWidth
                        required
                        size="medium"
                        variant="outlined"
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        error={!!errors.department}
                        helperText={errors.department}
                      >
                        <MenuItem value="" disabled>
                          Select department
                        </MenuItem>
                        {departments.map((dep) => (
                          <MenuItem key={dep} value={dep}>
                            {dep}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* SPECIALIZATION */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        fullWidth
                        required
                        size="medium"
                        variant="outlined"
                        label="Specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        error={!!errors.specialization}
                        helperText={errors.specialization}
                      >
                        <MenuItem value="" disabled>
                          Select specialization
                        </MenuItem>
                        {specializations.map((sp) => (
                          <MenuItem key={sp} value={sp}>
                            {sp}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* ---------- ROW 2 (4 x 3 = 12) ---------- */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        required
                        size="medium"
                        variant="outlined"
                        type="email"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>

                    {/* GENDER */}
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth size="medium" error={!!errors.gender}>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          labelId="gender-label"
                          id="gender"
                          label="Gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          {genders.map((g) => (
                            <MenuItem key={g} value={g}>
                              {g}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.gender && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, ml: 2 }}
                          >
                            {errors.gender}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        label="Symptoms"
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        placeholder="Headache, fever..."
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        required
                        size="medium"
                        variant="outlined"
                        type="time"
                        label="Time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        error={!!errors.time}
                        helperText={errors.time}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>

                  {/* button centered below grid */}
                  <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        px: 6,
                        bgcolor: "secondary.main",
                        ":hover": { bgcolor: "primary.main" },
                        transition: "0.3s ease",
                      }}
                    >
                      MAKE AN APPOINTMENT
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>

          <Snackbar
            open={submitState.open}
            autoHideDuration={4000}
            onClose={() => setSubmitState({ ...submitState, open: false })}
          >
            <Alert severity={submitState.severity}>
              {submitState.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
