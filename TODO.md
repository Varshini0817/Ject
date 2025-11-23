# TODO List for Updating Fitness Dashboard and Schema

## Backend

- [ ] Update `backend/model/workoutSchema.js` to add fields: age, height, weight as Number.
- [ ] Update `backend/controllers/workoutController.js` to handle new fields:
  - Save age, height, weight when creating or updating workouts.
  - Include age, height, weight in fetch responses.

## Frontend

- [ ] Modify `frontend/src/pages/dashboard/FitnessDashboard.jsx`:
  - Add age, height, weight to dummy data.
  - Update UI to display age, height, weight.
  - Add API call to fetch workouts including age, height, weight dynamically.
  - Replace dummy data with fetched data.

## Testing

- [ ] End-to-end testing of workflow including creating/updating user profile attributes (age, height, weight).
- [ ] Verifying dashboard dynamically reflects updated data.
