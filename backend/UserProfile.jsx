import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  Chip,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#48a4b0ff" },
    secondary: { main: "#0A6C91" },
    accent: { main: "#4FD1C5" },
    background: { default: "#0f172a" },
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

function ProfileSideBySide(props) {
  const params = useParams();
  const username = props.username || params.username;

  const [formData, setFormData] = useState({
    username: username || "",
    fullName: "",
    age: "",
    phone: "",
    occupation: "",
    email: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    address: "",
    avatarUrl: "",
    _id: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (!username) return;

    axios
      .get(`http://localhost:5000/api/user/profile/${username}`)
      .then((response) => {
        if (response.data) {
          const data = response.data;
          const gender = data.gender;
          const seed = data.fullName?.trim() || username;

          let avatarUrl = "";
          if (gender === "male") {
            avatarUrl = `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(
              seed
            )}`;
          } else if (gender === "female") {
            avatarUrl = `https://avatar.iran.liara.run/public/girl?username=${encodeURIComponent(
              seed
            )}`;
          } else {
            avatarUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
              seed
            )}`;
          }

          setFormData({
            ...data,
            username,
            avatarUrl,
          });
          setIsEditing(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setIsEditing(true); // new user
      });
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSave = () => {
    setErrorMessage("");

    const requiredFields = [
      "fullName",
      "age",
      "phone",
      "occupation",
      "gender",
      "city",
      "state",
      "country",
      "postalCode",
      "address",
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      const value = String(formData[field] || "").trim();
      if (!value) newErrors[field] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      toast.error("Please fill all required fields before saving.");
      return;
    }

    setFieldErrors({});
    const payload = { ...formData, username };

    if (!formData._id) {
      axios
        .post(`http://localhost:5000/api/user/profile/${username}`, payload)
        .then((response) => {
          setFormData(response.data);
          setIsEditing(false);
          toast.success("Profile created successfully.");
        })
        .catch((error) => {
          console.error("Error saving user profile:", error);
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Error saving user profile.");
          }
        });
    } else {
      axios
        .put(`http://localhost:5000/api/user/profile/${username}`, payload)
        .then((response) => {
          setFormData(response.data);
          setIsEditing(false);
          toast.success("Profile updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating user profile:", error);
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Error updating user profile.");
          }
        });
    }
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/);
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setErrorMessage("");
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#FFFFFF",
      fontSize: 13,
      "& fieldset": {
        borderColor: "rgba(148, 163, 184, 0.7)",
      },
      "&:hover fieldset": {
        borderColor: "#0A6C91",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#48a4b0ff",
        boxShadow: "0 0 0 1px rgba(72, 164, 176, 0.3)",
      },
    },
  };

  const sectionTitleSx = {
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "primary.main",
    mb: 0.4,
    textAlign: "center",
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          height: "100vh",
          overflow: "auto",
          background:
            "radial-gradient(circle at top left, #4FD1C5 0, transparent 55%), radial-gradient(circle at bottom right, #0A6C91 0, #020617 55%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          p: { xs: 0.5, md: 1.5 },
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 1150,
            height: "auto",
            borderRadius: 4,
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.65)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            bgcolor: "rgba(248, 250, 252, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            overflow: "hidden",
          }}
        >
          {/* LEFT PANEL */}
          <Box
            sx={{
              width: { xs: "100%", md: "32%" },
              background:
                "linear-gradient(155deg, #0A6C91 0%, #48a4b0ff 40%, #4FD1C5 100%)",
              color: "#F9FAFB",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 1.5, md: 2.5 },
            }}
          >
            <Stack
              spacing={1.6}
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              <Avatar
                src={!avatarError && formData.avatarUrl ? formData.avatarUrl : undefined}
                onError={() => setAvatarError(true)}
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 80, md: 100 },
                  border: "3px solid rgba(248, 250, 252, 0.85)",
                  boxShadow: "0 8px 22px rgba(15,23,42,0.55)",
                  bgcolor: "#cbd5f5",
                  color: "#111827",
                  fontWeight: 600,
                  fontSize: 26,
                }}
              >
                {(!formData.avatarUrl || avatarError) &&
                  getInitials(formData.fullName || formData.username || "")}
              </Avatar>

              {formData.fullName && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.9,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Profile
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mt: 0.3, wordBreak: "break-word" }}
                  >
                    @{formData.username}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.85, mt: 0.2, fontSize: 13 }}
                  >
                    {formData.email}
                  </Typography>
                </Box>
              )}

              {formData.occupation && (
                <Chip
                  label={formData.occupation}
                  sx={{
                    backgroundColor: "rgba(15, 23, 42, 0.15)",
                    borderRadius: 999,
                    px: 1.6,
                    height: 26,
                    color: "#F9FAFB",
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                />
              )}

              <Divider
                flexItem
                sx={{
                  borderColor: "rgba(248, 250, 252, 0.35)",
                  my: 1,
                }}
              />

              {formData.fullName && (
                <Box sx={{ width: "100%", fontSize: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.9, mb: 0.3, fontWeight: 500, fontSize: 13 }}
                  >
                    Quick info
                  </Typography>
                  <Stack spacing={0.3} sx={{ opacity: 0.95 }}>
                    {formData.age && (
                      <Typography>
                        Age: <strong>{formData.age}</strong>
                      </Typography>
                    )}
                    {formData.phone && (
                      <Typography sx={{ whiteSpace: "nowrap" }}>
                        Phone: <strong>{formData.phone}</strong>
                      </Typography>
                    )}
                    {(formData.city || formData.country) && (
                      <Typography>
                        Location:{" "}
                        <strong>
                          {[formData.city, formData.country]
                            .filter(Boolean)
                            .join(", ")}
                        </strong>
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>

          {/* RIGHT PANEL */}
          <Box
            sx={{
              width: { xs: "100%", md: "90%" },
              px: { xs: 1.2, md: 2.6 },
              py: { xs: 1.3, md: 2.1 },
            }}
          >
            <CardContent
              sx={{
                p: 0,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* HEADER CENTERED */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    letterSpacing: 1.5,
                    fontSize: 10,
                  }}
                >
                  Account
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  Personal Information
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.2, fontSize: 12 }}
                >
                  Manage your basic information and contact details.
                </Typography>
              </Box>



              {errorMessage && (
                <Box
                  sx={{
                    mb: 1,
                    p: 0.8,
                    bgcolor: "#FEF2F2",
                    color: "#B91C1C",
                    borderRadius: 2,
                    border: "1px solid #FCA5A5",
                    fontSize: 12,
                  }}
                >
                  {errorMessage}
                </Box>
              )}

              {/* MAIN CONTENT */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>

                {/* BASIC DETAILS */}
                <Box>
                  <Typography sx={sectionTitleSx}>Basic Details</Typography>

                  <Grid container spacing={1.5}>
                    {/* FULL NAME - row 1 left */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mb: 0.2,
                          fontWeight: 600,
                          color: "text.secondary",
                          letterSpacing: 0.4,
                          textTransform: "uppercase",
                          fontSize: 10,
                        }}
                      >
                        Full Name
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName || ""}
                        onChange={handleChange}
                        sx={fieldSx}
                        disabled={!isEditing}
                        error={Boolean(fieldErrors.fullName)}
                        placeholder="Enter your full name"
                      />
                    </Grid>

                    {/* GENDER - row 1 right */}
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mb: 0.3,
                          fontWeight: 600,
                          color: "text.secondary",
                          letterSpacing: 0.4,
                          textTransform: "uppercase",
                          fontSize: 10,
                        }}
                      >
                        Gender
                      </Typography>

                      <FormControl
                        error={Boolean(fieldErrors.gender)}
                        sx={{ width: "100%" }}
                      >
                        <RadioGroup
                          row
                          name="gender"
                          value={formData.gender || ""}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="Male"
                            control={
                              <Radio
                                size="small"
                                sx={{ "&.Mui-checked": { color: "primary.main" } }}
                              />
                            }
                            label="Male"
                            disabled={!isEditing}
                          />
                          <FormControlLabel
                            value="Female"
                            control={
                              <Radio
                                size="small"
                                sx={{ "&.Mui-checked": { color: "primary.main" } }}
                              />
                            }
                            label="Female"
                            disabled={!isEditing}
                          />
                          <FormControlLabel
                            value="other"
                            control={
                              <Radio
                                size="small"
                                sx={{ "&.Mui-checked": { color: "primary.main" } }}
                              />
                            }
                            label="Other"
                            disabled={!isEditing}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    {/* AGE - row 2 col 1 */}
                    <Grid item xs={12} md={4}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mb: 0.2,
                          fontWeight: 600,
                          color: "text.secondary",
                          letterSpacing: 0.4,
                          textTransform: "uppercase",
                          fontSize: 10,
                        }}
                      >
                        Age
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        id="age"
                        name="age"
                        value={formData.age || ""}
                        onChange={handleChange}
                        sx={fieldSx}
                        disabled={!isEditing}
                        type="number"
                        error={Boolean(fieldErrors.age)}
                        placeholder="Enter your age"
                      />
                    </Grid>

                    {/* PHONE - row 2 col 2 */}
                    <Grid item xs={12} md={4}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mb: 0.2,
                          fontWeight: 600,
                          color: "text.secondary",
                          letterSpacing: 0.4,
                          textTransform: "uppercase",
                          fontSize: 10,
                        }}
                      >
                        Phone
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        id="phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        sx={fieldSx}
                        disabled={!isEditing}
                        error={Boolean(fieldErrors.phone)}
                        placeholder="Enter your phone number"
                      />
                    </Grid>

                    {/* OCCUPATION - row 2 col 3 */}
                    <Grid item xs={12} md={4}>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mb: 0.2,
                          fontWeight: 600,
                          color: "text.secondary",
                          letterSpacing: 0.4,
                          textTransform: "uppercase",
                          fontSize: 10,
                        }}
                      >
                        Occupation
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        id="occupation"
                        name="occupation"
                        value={formData.occupation || ""}
                        onChange={handleChange}
                        sx={fieldSx}
                        disabled={!isEditing}
                        error={Boolean(fieldErrors.occupation)}
                        placeholder="Enter your occupation"
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* LOCATION */}
                <Box>
                  <Typography sx={sectionTitleSx}>Location</Typography>
                  <Grid container spacing={1.4}>
                    {[
                      { name: "city", label: "City", placeholder: "Enter your city" },
                      { name: "state", label: "State", placeholder: "Enter your state" },
                      {
                        name: "country",
                        label: "Country",
                        placeholder: "Enter your country",
                      },
                      {
                        name: "postalCode",
                        label: "Postal Code",
                        placeholder: "Enter your postal / ZIP code",
                      },
                    ].map(({ name, label, placeholder }) => (
                      <Grid item xs={12} md={3} key={name}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mb: 0.2,
                            fontWeight: 600,
                            color: "text.secondary",
                            letterSpacing: 0.4,
                            textTransform: "uppercase",
                            fontSize: 10,
                          }}
                        >
                          {label}
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          id={name}
                          name={name}
                          value={formData[name] || ""}
                          onChange={handleChange}
                          sx={fieldSx}
                          disabled={!isEditing}
                          error={Boolean(fieldErrors[name])}
                          placeholder={placeholder}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* ADDRESS */}
                <Box>
                  <Typography sx={sectionTitleSx}>Address</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mb: 0.2,
                      fontWeight: 600,
                      color: "text.secondary",
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                      fontSize: 10,
                      textAlign: "left",
                    }}
                  >
                    Full Address
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    sx={fieldSx}
                    disabled={!isEditing}
                    placeholder="Street, area, landmark, etc."
                    error={Boolean(fieldErrors.address)}
                  />
                </Box>

                {/* BUTTONS */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: { xs: 1, md: "auto" },
                    gap: 1,
                  }}
                >
                  {!isEditing ? (
                    <Button
                      variant="contained"
                      onClick={handleEditClick}
                      sx={{
                        px: 3,
                        py: 0.8,
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 999,
                        fontSize: 13,
                        bgcolor: "primary.main",
                        boxShadow: "0 8px 20px rgba(72,164,176,0.45)",
                        "&:hover": {
                          bgcolor: "secondary.main",
                          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.7)",
                        },
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                        sx={{
                          px: 2.5,
                          py: 0.8,
                          textTransform: "none",
                          fontWeight: 500,
                          borderRadius: 999,
                          fontSize: 13,
                          borderColor: "rgba(148,163,184,0.8)",
                          color: "text.secondary",
                          "&:hover": {
                            borderColor: "text.secondary",
                            bgcolor: "rgba(148, 163, 184, 0.08)",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                          px: 3,
                          py: 0.8,
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 999,
                          fontSize: 13,
                          bgcolor: "accent.main",
                          color: "#020617",
                          boxShadow: "0 8px 20px rgba(56,189,248,0.45)",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "#F9FAFB",
                            boxShadow: "0 10px 26px rgba(15,23,42,0.8)",
                          },
                        }}
                      >
                        Save Profile
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default ProfileSideBySide;
