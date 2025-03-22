import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckoutHistory from './LiHistSubcomponents/CheckoutHistory';
import DonationHistory from './/LiHistSubcomponents/DonationHistory';
import EventHistory from './/LiHistSubcomponents/EventHistory';
import FineHistory from './/LiHistSubcomponents/FineHistory';
import WaitlistHistory from './/LiHistSubcomponents/WaitlistHistory';

// defining types
interface InventoryItem {
  id: string;
  type: 'book' | 'movie' | 'technology';
  title: string;
  status: string;
  author?: string;
  director?: string;
  runtime?: number;
  manufacturer?: string;
  model?: string;
}

interface Event {
  id: string;
  eventName: string;
  eventDate: string;
  description: string;
}

const Employee: React.FC = () => {
  // state for current view
  const [currentView, setCurrentView] = useState<'dashboard' | 'inventory' | 'events' | 'libraryHistory'>('dashboard');
  const [tabValue, setTabValue] = useState(0); // state for Library History tabs

  // inventory management
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryForm, setInventoryForm] = useState<Omit<InventoryItem, 'id'>>({
    type: 'book',
    title: '',
    status: 'available',
    author: '',
    director: '',
    runtime: 0,
    manufacturer: '',
    model: '',
  });

  // event management
  const [events, setEvents] = useState<Event[]>([]);
  const [eventForm, setEventForm] = useState<Omit<Event, 'id'>>({
    eventName: '',
    eventDate: '',
    description: '',
  });

  // adding inventory item
  const handleAddInventory = () => {
    const newItem: InventoryItem = { ...inventoryForm, id: String(inventory.length + 1) };
    setInventory([...inventory, newItem]);
    setInventoryForm({
      type: 'book',
      title: '',
      status: 'available',
      author: '',
      director: '',
      runtime: 0,
      manufacturer: '',
      model: '',
    });
  };

  // deleting inventory item
  const handleDeleteInventory = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  // render inventory form based on the selected type
  const renderInventoryForm = () => {
    switch (inventoryForm.type) {
      case 'book':
        return (
          <TextField
            fullWidth
            label="Author"
            value={inventoryForm.author}
            onChange={(e) => setInventoryForm({ ...inventoryForm, author: e.target.value })}
            margin="normal"
          />
        );
      case 'movie':
        return (
          <>
            <TextField
              fullWidth
              label="Director"
              value={inventoryForm.director}
              onChange={(e) => setInventoryForm({ ...inventoryForm, director: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Runtime (minutes)"
              type="number"
              value={inventoryForm.runtime}
              onChange={(e) => setInventoryForm({ ...inventoryForm, runtime: Number(e.target.value) })}
              margin="normal"
            />
          </>
        );
      case 'technology':
        return (
          <>
            <TextField
              fullWidth
              label="Manufacturer"
              value={inventoryForm.manufacturer}
              onChange={(e) => setInventoryForm({ ...inventoryForm, manufacturer: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Model"
              value={inventoryForm.model}
              onChange={(e) => setInventoryForm({ ...inventoryForm, model: e.target.value })}
              margin="normal"
            />
          </>
        );
      default:
        return null;
    }
  };

  // render inventory management section
  const renderInventoryManagement = () => {
    return (
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          Inventory Management
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={inventoryForm.type}
            onChange={(e) => setInventoryForm({ ...inventoryForm, type: e.target.value as 'book' | 'movie' | 'technology' })}
          >
            <MenuItem value="book">Book</MenuItem>
            <MenuItem value="movie">Movie</MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Title"
          value={inventoryForm.title}
          onChange={(e) => setInventoryForm({ ...inventoryForm, title: e.target.value })}
          margin="normal"
        />
        {renderInventoryForm()}
        <Button variant="contained" color="primary" onClick={handleAddInventory} sx={{ marginTop: 2 }}>
          Add Item
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {item.type === 'book' && `Author: ${item.author}`}
                    {item.type === 'movie' && `Director: ${item.director}, Runtime: ${item.runtime} mins`}
                    {item.type === 'technology' && `Manufacturer: ${item.manufacturer}, Model: ${item.model}`}
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteInventory(item.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  // adding event
  const handleAddEvent = () => {
    const newEvent: Event = { ...eventForm, id: String(events.length + 1) };
    setEvents([...events, newEvent]);
    setEventForm({ eventName: '', eventDate: '', description: '' });
  };

  // render the current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h5" gutterBottom>
              Dashboard
            </Typography>
            <Typography>Total Items: {inventory.length}</Typography>
            <Typography>Upcoming Events: {events.length}</Typography>
          </Paper>
        );

      case 'inventory':
        return renderInventoryManagement();

      case 'events':
        return (
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h5" gutterBottom>
              Event Management
            </Typography>
            <TextField
              fullWidth
              label="Event Name"
              value={eventForm.eventName}
              onChange={(e) => setEventForm({ ...eventForm, eventName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Event Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={eventForm.eventDate}
              onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddEvent} sx={{ marginTop: 2 }}>
              Add Event
            </Button>
            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Event Date</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.eventName}</TableCell>
                      <TableCell>{event.eventDate}</TableCell>
                      <TableCell>{event.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );

      case 'libraryHistory':
        return (
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h5" gutterBottom>
              Library History
            </Typography>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Checkout History" />
              <Tab label="Donation History" />
              <Tab label="Event History" />
              <Tab label="Fine History" />
              <Tab label="Waitlist History" />
            </Tabs>
            <Box sx={{ marginTop: 2 }}>
              {tabValue === 0 && <CheckoutHistory />}
              {tabValue === 1 && <DonationHistory />}
              {tabValue === 2 && <EventHistory />}
              {tabValue === 3 && <FineHistory />}
              {tabValue === 4 && <WaitlistHistory />}
            </Box>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
          <Button color="inherit" onClick={() => setCurrentView('dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => setCurrentView('inventory')}>
            Inventory
          </Button>
          <Button color="inherit" onClick={() => setCurrentView('events')}>
            Events
          </Button>
          <Button color="inherit" onClick={() => setCurrentView('libraryHistory')}>
            Library History
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 3 }}>
        {renderView()}
      </Container>
    </Box>
  );
};

export default Employee;