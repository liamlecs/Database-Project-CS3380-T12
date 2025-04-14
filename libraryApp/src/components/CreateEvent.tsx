import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const ageGroups = [
  { id: 1, label: '0-2' },
  { id: 2, label: '3-8' },
  { id: 3, label: '9-13' },
  { id: 4, label: '14-17' },
  { id: 5, label: '18+' },
];

const categories = [
  { id: 1, label: 'Educational' },
  { id: 2, label: 'Social' },
  { id: 3, label: 'Cultural' },
];

const CreateEvent: React.FC = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs().add(1, 'hour'));
  const [ageGroup, setAgeGroup] = useState<number>(1);
  const [category, setCategory] = useState<number>(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const payload = {
      title,
      location,
      startTimestamp: startTime?.toISOString(),
      endTimestamp: endTime?.toISOString(),
      ageGroup,
      categoryId: category,
      isPrivate,
      description,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create event');
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>

      <Stack spacing={2}>
        <TextField
          label="Event Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Location"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
            <DateTimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              disablePast
              sx={{ flex: 1 }}
            />
            <DateTimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              disablePast
              sx={{ flex: 1 }}
            />
          </Stack>
        </LocalizationProvider>

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <FormControl fullWidth>
            <InputLabel>Age Group</InputLabel>
            <Select
              value={ageGroup}
              onChange={(e) => setAgeGroup(Number(e.target.value))}
              label="Age Group"
            >
              {ageGroups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <FormControlLabel
          control={
            <Switch
              checked={isPrivate}
              onChange={() => setIsPrivate((prev) => !prev)}
            />
          }
          label="Private Event?"
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box textAlign="right">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Submit Event
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default CreateEvent;


