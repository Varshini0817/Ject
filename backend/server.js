const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db');
const workoutsRouter = require('./routes/routing');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/user/', workoutsRouter);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// basic error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error', err);
    res.status(500).json({ error: 'internal server error' });
});

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
