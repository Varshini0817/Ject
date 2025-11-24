import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import {
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar,
} from 'recharts';

const ACTIVITIES = [
  "Running",
  "Cycling",
  "Skipping",
  "Walking",
  "Gym",
  "Hiking",
  "Yoga"
];

// Mapping of activities to relevant metrics to display
const activityMetricsMap = {
  Running: ['duration', 'distance', 'calories'],
  Cycling: ['duration', 'distance', 'calories'],
  Skipping: ['duration', 'steps', 'calories'],
  Walking: ['duration', 'distance', 'steps', 'calories'],
  Gym: ['duration', 'calories'],
  Hiking: ['duration', 'distance', 'calories'],
  Yoga: ['duration', 'calories'],
};

const CHART_TYPES = [
  {value:"", label: "Select Chart Type"},
  {value: 'pie', label: 'Pie Chart'},
  {value: 'line', label: 'Line Graph'},
  {value: 'bar', label: 'Bar Graph'},
  {value: 'other', label: 'Other'},
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function ActivityStats({ username }) {
  const [activity, setActivity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    setError(null);
    setIsLoading(true);

    if (!activity || !startDate || !endDate) {
      setError('Please select activity and date range.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/stats/timeseries/${encodeURIComponent(username)}/${encodeURIComponent(activity)}`,
        {
          params: {
            startDate,
            endDate
          }
        }
      );
      const data = response.data;
      const noData = !data || !data.timeSeriesData || data.timeSeriesData.length === 0;

      if (noData) {
        setError('No data found for the selected time period.');
        setStats(null);
      } else {
        setStats(data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error fetching statistics');
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for Pie chart from time series (aggregate sums)
  const getPieData = () => {
    if (!stats) return [];
    const totalDuration = stats.timeSeriesData.reduce((sum, d) => sum + d.duration, 0);
    const totalDistance = stats.timeSeriesData.reduce((sum, d) => sum + d.distance, 0);
    const totalSteps = stats.timeSeriesData.reduce((sum, d) => sum + d.steps, 0);
    const totalCalories = stats.timeSeriesData.reduce((sum, d) => sum + d.calories, 0);
  const relevantMetrics = activityMetricsMap[stats.activity] || ['duration', 'distance', 'steps', 'calories'];

  const pieData = [
    { name: 'Duration (min)', metric: 'duration', value: totalDuration },
    { name: 'Distance (km)', metric: 'distance', value: totalDistance },
    { name: 'Steps', metric: 'steps', value: totalSteps },
    { name: 'Calories', metric: 'calories', value: totalCalories },
  ];

  // Filter pie data to include only relevant metrics
  return pieData.filter(d => relevantMetrics.includes(d.metric));
};

  // Helper to get time series data array for a specific metric
  const getTimeSeriesMetricData = (metric) => {
    if (!stats) return [];
    return stats.timeSeriesData.map(point => ({
      date: point.date,
      value: point[metric] || 0,
    }));
  };

  // Render a single line chart for a given metric
  const renderLineChartForMetric = (metric, color) => {
    const data = getTimeSeriesMetricData(metric);
    return (
      <Box sx={{ mb: 3 }} key={metric}>
        <Typography variant="subtitle1" gutterBottom>
          {metric.charAt(0).toUpperCase() + metric.slice(1)} over Time
        </Typography>
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} />
        </LineChart>
      </Box>
    );
  };

  // Render a single bar chart for a given metric
  const renderBarChartForMetric = (metric, color) => {
    const data = getTimeSeriesMetricData(metric);
    return (
      <Box sx={{ mb: 3 }} key={metric}>
        <Typography variant="subtitle1" gutterBottom>
          {metric.charAt(0).toUpperCase() + metric.slice(1)} over Time
        </Typography>
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </Box>
    );
  };

  const renderChart = () => {
    if (!stats) return null;

    switch(chartType) {
      case 'pie':
        // Pie chart shows aggregate sums
        return (
          <PieChart width={400} height={300}>
            <Pie
              data={getPieData()}
              cx={200}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {getPieData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'line': {
      // Render separate line charts per metric
      const relevantMetricsLine = activityMetricsMap[stats.activity] || ['duration', 'distance', 'steps', 'calories'];
      const metricColorsLine = {
        duration: '#8884d8',
        steps: '#ff7300',
        calories: '#a83232',
        distance: '#82ca9d',
      };
      
      return (
        <Box>
          {relevantMetricsLine.map(metric => renderLineChartForMetric(metric, metricColorsLine[metric]))}
        </Box>
      );
      }
      case 'bar': {
      // Render separate bar charts per metric
      const relevantMetricsBar = activityMetricsMap[stats.activity] || ['duration', 'distance', 'steps', 'calories'];
      const metricColorsBar = {
        duration: '#8884d8',
        steps: '#ff7300',
        calories: '#a83232',
        distance: '#82ca9d',
      };
      
      return (
        <Box>
          {relevantMetricsBar.map(metric => renderBarChartForMetric(metric, metricColorsBar[metric]))}
        </Box>
      );
      }
      case 'other':
      default:
        // Show aggregate textual stats
        const relevantMetrics = activityMetricsMap[stats.activity] || ['duration', 'distance', 'steps', 'calories'];
        const totalDuration = stats.timeSeriesData.reduce((sum, d) => sum + d.duration, 0);
        const totalDistance = stats.timeSeriesData.reduce((sum, d) => sum + d.distance, 0);
        const totalSteps = stats.timeSeriesData.reduce((sum, d) => sum + d.steps, 0);
        const totalCalories = stats.timeSeriesData.reduce((sum, d) => sum + d.calories, 0);
        return (
          <Box sx={{ mt: 2 }}>
            <Typography><strong>Activity:</strong> {stats.activity}</Typography>
            {relevantMetrics.includes('duration') && <Typography><strong>Duration:</strong> {totalDuration} mins</Typography>}
            {relevantMetrics.includes('distance') && <Typography><strong>Distance:</strong> {totalDistance} kms</Typography>}
            {relevantMetrics.includes('steps') && <Typography><strong>Steps:</strong> {totalSteps}</Typography>}
            {relevantMetrics.includes('calories') && <Typography><strong>Calories Burned:</strong> {totalCalories}</Typography>}
            <Typography><em>From {stats.startDate} to {stats.endDate}</em></Typography>
          </Box>
        );
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Activity Statistics
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Activity</InputLabel>
          <Select
            value={activity}
            label="Activity"
            onChange={(e) => setActivity(e.target.value)}
          >
            <MenuItem value="">
              <em>Select Activity</em>
            </MenuItem>
            {ACTIVITIES.map((a) => (
              <MenuItem key={a} value={a}>{a}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
          inputProps={{ max: new Date().toISOString().slice(0, 10) }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
          inputProps={{ max: new Date().toISOString().slice(0, 10) }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            label="Chart Type"
            onChange={(e) => setChartType(e.target.value)}
          >
            {CHART_TYPES.map((c) => (
              <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={fetchStats} sx={{ minWidth: 150 }} disabled={isLoading}>
          {isLoading ? "Loading..." : "Get Stats"}
        </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {renderChart()}
    </Paper>
  );
}

export default ActivityStats;
