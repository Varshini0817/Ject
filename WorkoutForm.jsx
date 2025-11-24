import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Stack,
  Chip,
  Divider,
  Modal,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

const ACTIVITIES = [
  { value: "Running" },
  { value: "Cycling" },
  { value: "Skipping" },
  { value: "Walking" },
  { value: "Gym" },
  { value: "Hiking" },
  { value: "Yoga" },
];

const WorkoutForm = ({ username }) => {
  const theme = useTheme();

  const [activity, setActivity] = useState("");
  const [checking, setChecking] = useState(false);
  const [hasGoal, setHasGoal] = useState(false);
  const [goal, setGoal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [entryDate, setEntryDate] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [distanceError, setDistanceError] = useState("");
  const [steps, setSteps] = useState("");

  const [goalDraft, setGoalDraft] = useState({
    activityName: "",
    duration: "",
    distance: "",
    steps: "",
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  useEffect(() => {
    if (!activity || !username) return;
    checkGoal(activity);
  }, [activity, username]);

  // ⭐ Check if goal exists for the activity
  const checkGoal = async (act) => {
    setChecking(true);
    setHasGoal(false);
    setGoal(null);
    setGoalDraft({ activityName: act, duration: "", distance: "", steps: "" });

    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/goals/${username}/${act}`
      );

      if (!mountedRef.current) return;

      if (res.data.hasGoal) {
        setHasGoal(true);
        setGoal(res.data.goal);
        setModalOpen(false);
      } else {
        setModalOpen(true);
      }
    } catch (err) {
      toast.error("Unable to fetch goal");
      setModalOpen(true);
    } finally {
      if (mountedRef.current) setChecking(false);
    }
  };

  // Distance input change handler - with validation
  const handleDistanceChange = (value) => {
    setDistance(value);
    setDistanceError("");
    if (value === "") return;
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) {
      setDistanceError("Distance must be a non-negative number");
    }
  };

  // ⭐ Activity-specific fields
  const fieldsForActivity = (act) => {
    switch (act) {
      case "Running":
      case "Cycling":
      case "Hiking":
        return { duration: true, distance: true, steps: false };
      case "Skipping":
        return { duration: true, distance: false, steps: true };
      case "Gym":
      case "Yoga":
        return { duration: true, distance: false, steps: false };
      default:
        return { duration: true, distance: true, steps: true };
    }
  };

  // ⭐ Save new goal
  const saveGoal = async () => {
    try {
      const payload = {
        activity: goalDraft.activityName,
        ...(goalDraft.duration && { duration: Number(goalDraft.duration) }),
        ...(goalDraft.distance && { distance: Number(goalDraft.distance) }),
        ...(goalDraft.steps && { steps: Number(goalDraft.steps) }),
      };

      const res = await axios.post(
        `http://localhost:5000/api/user/goals/${username}`,
        payload
      );

      setGoal(res.data.goal);
      setHasGoal(true);
      setModalOpen(false);
      toast.success("Goal saved!");
    } catch (err) {
      toast.error("Failed to save goal");
    }
  };

  // ⭐ Save workout entry
  const saveEntry = async () => {
    if (!activity) return toast.error("Please select an activity first.");
    if (!hasGoal) return toast.error("Please set a goal before logging entry.");

    if (distanceError) {
      return toast.error("Please fix errors before saving.");
    }

    const fields = fieldsForActivity(activity);

    // Sanitize distance input for sending: if empty or invalid, convert to 0
    let sanitizedDistance =
      fields.distance && distance !== "" ? Number(distance) : 0;

    if (fields.distance && (isNaN(sanitizedDistance) || sanitizedDistance < 0)) {
      return toast.error("Distance must be a valid non-negative number.");
    }

    const body = {
      activity,
      date: entryDate,
      ...(fields.duration && { duration: Number(duration) }),
      ...(fields.distance && { distance: sanitizedDistance }),
      ...(fields.steps && { steps: Number(steps) }),
    };

    try {
      await axios.post(
        `http://localhost:5000/api/user/entries/${username}`,
        body
      );

      setActivity("");
      setEntryDate("");
      setDuration("");
      setDistance("");
      setDistanceError("");
      setSteps("");
      setHasGoal(false);

      toast.success("Workout entry saved!");
    } catch (err) {
      toast.error("Failed to save entry");
    }
  };

  // ⭐ Shared TextField styling
  const commonFieldSx = {
    "& .MuiInputLabel-root": { color: "#1E2D2F" },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.primary.main,
    },
    "& .MuiOutlinedInput-root": {
      color: theme.palette.text.primary,
      "& fieldset": {
        borderColor: "rgba(0,0,0,0.4)",
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        // ⭐ FITNESS background
        backgroundImage: `
          linear-gradient(115deg, rgba(15,149,176,0.85), rgba(16,174,194,0.75)),
          url("https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 0,

            // ⭐ Transparent white card
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.7)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#1E2D2F" }}>
            Workout Entry
          </Typography>

          {/* Activity selector */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Activity</InputLabel>
              <Select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                label="Activity"
              >
                <MenuItem value="">
                  <em>Select Activity</em>
                </MenuItem>
                {ACTIVITIES.map((a) => (
                  <MenuItem key={a.value} value={a.value}>
                    {a.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ⭐ ONLY show chip after selection */}
            {activity && (
              <Chip
                label={
                  checking
                    ? "Checking..."
                    : hasGoal
                    ? "Goal Set"
                    : "No Goal"
                }
                color={hasGoal ? "success" : "warning"}
                variant={hasGoal ? "filled" : "outlined"}
                sx={{ borderRadius: 0, alignSelf: "center" }}
              />
            )}
          </Stack>

          {/* Fields when goal exists */}
          {hasGoal && (
            <>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    InputLabelProps={{ shrink: true }}
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    sx={commonFieldSx}
                  />
                </Grid>

                {fieldsForActivity(activity).duration && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Duration (mins)"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      sx={commonFieldSx}
                    />
                  </Grid>
                )}

                {fieldsForActivity(activity).distance && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Distance (km)"
                      type="number"
                      value={distance}
                      onChange={(e) => handleDistanceChange(e.target.value)}
                      sx={commonFieldSx}
                      error={!!distanceError}
                      helperText={distanceError}
                    />
                  </Grid>
                )}

                {fieldsForActivity(activity).steps && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Steps"
                      type="number"
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                      sx={commonFieldSx}
                    />
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {/* Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              disabled={!hasGoal}
              onClick={saveEntry}
              sx={{
                borderRadius: 0,
                background: theme.palette.gradients.primaryButton,
              }}
            >
              Save Entry
            </Button>

            <Button
              fullWidth
              variant="outlined"
              disabled={!activity}
              onClick={() => {
                setGoalDraft({
                  activityName: activity,
                  duration: goal?.duration || "",
                  distance: goal?.distance || "",
                  steps: goal?.steps || "",
                });
                setModalOpen(true);
              }}
              sx={{ borderRadius: 0 }}
            >
              {hasGoal ? "Edit Goal" : "Set Goal"}
            </Button>
          </Stack>

          {/* Show current goal */}
          {hasGoal && goal && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                border: "1px solid rgba(0,0,0,0.3)",
                backgroundColor: "rgba(255,255,255,0.6)",
                borderRadius: 0,
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "#1E2D2F" }}>
                Current Goal
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {goal.duration && `Duration: ${goal.duration} mins`}{" "}
                {goal.distance && ` • Distance: ${goal.distance} km`}{" "}
                {goal.steps && ` • Steps: ${goal.steps}`}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>

      {/* ⭐ Modal — Set Goal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            width: 400,
            backgroundColor: "rgba(255,255,255,0.95)",
            p: 3,
            borderRadius: 0,
            position: "absolute",
            boxShadow: 6,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#1E2D2F" }}>
            Set Goal — {goalDraft.activityName}
          </Typography>

          {fieldsForActivity(goalDraft.activityName).duration && (
            <TextField
              fullWidth
              label="Duration (mins)"
              type="number"
              value={goalDraft.duration}
              onChange={(e) =>
                setGoalDraft((g) => ({ ...g, duration: e.target.value }))
              }
              sx={{ mb: 2, ...commonFieldSx }}
            />
          )}

          {fieldsForActivity(goalDraft.activityName).distance && (
            <TextField
              fullWidth
              label="Distance (km)"
              type="number"
              value={goalDraft.distance}
              onChange={(e) =>
                setGoalDraft((g) => ({ ...g, distance: e.target.value }))
              }
              sx={{ mb: 2, ...commonFieldSx }}
            />
          )}

          {fieldsForActivity(goalDraft.activityName).steps && (
            <TextField
              fullWidth
              label="Steps"
              type="number"
              value={goalDraft.steps}
              onChange={(e) =>
                setGoalDraft((g) => ({ ...g, steps: e.target.value }))
              }
              sx={{ mb: 2, ...commonFieldSx }}
            />
          )}

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={saveGoal}
              sx={{
                borderRadius: 0,
                background: theme.palette.gradients.primaryButton,
              }}
            >
              Save Goal
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setModalOpen(false)}
              sx={{ borderRadius: 0 }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default WorkoutForm;
