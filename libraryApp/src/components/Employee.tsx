import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import DonationHistory from './LiHistSubcomponents/DonationHistory';
import EventHistory from './LiHistSubcomponents/EventHistory';
import FineHistory from './LiHistSubcomponents/FineHistory';
import WaitlistHistory from './LiHistSubcomponents/WaitlistHistory';

// defining types
interface InventoryItem {
  id: number;
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
  eventId: number;
  title: string;
  startTimestamp: string;
  description: string;
  location: string;
}

const Employee: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'inventory' | 'events' | 'libraryHistory'>('dashboard');
  const [tabValue, setTabValue] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isEmployee = localStorage.getItem('isEmployee');
    if (!isEmployee) {
      navigate('/login');
    }
  }, [navigate]);

  // check authorization 
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/LoginPage');
      return;
    }

    const parsedData = JSON.parse(userData);
    if (!parsedData.isEmployee) {
      navigate('/unauthorized');
      return;
    }

    setIsAuthorized(true);
  }, [navigate]);

  // If not authorized, return null
  if (!isAuthorized) {
    return null;
  }

  // inventory form state
  const [inventoryForm, setInventoryForm] = useState({
    type: 'book' as 'book' | 'movie' | 'technology',
    title: '',
    status: 'available',
    author: '',
    director: '',
    runtime: 0,
    manufacturer: '',
    model: '',
  });

  // event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    startTimestamp: '',
    description: '',
    location: ''
  });

  // fetch data when view changes
  useEffect(() => {
    if (currentView === 'inventory' || currentView === 'dashboard') {
      fetchInventory();
    }
    if (currentView === 'events' || currentView === 'dashboard') {
      fetchEvents();
    }
  }, [currentView]);

  // fetch inventory from backend
  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/Item');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/Event');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // add new inventory item
  const handleAddInventory = async () => {
    try {
      const response = await fetch('/api/Item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventoryForm),
      });

      if (response.ok) {
        fetchInventory();
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
      }
    } catch (error) {
      console.error('Error adding inventory:', error);
    }
  };

  // delete inventory item
  const handleDeleteInventory = async (id: number) => {
    try {
      const response = await fetch(`/api/Item/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInventory();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // add new event
  const handleAddEvent = async () => {
    try {
      const response = await fetch('/api/Event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventForm.title,
          startTimestamp: eventForm.startTimestamp,
          description: eventForm.description,
          location: eventForm.location
        }),
      });

      if (response.ok) {
        fetchEvents();
        setEventForm({
          title: '',
          startTimestamp: '',
          description: '',
          location: ''
        });
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // delete event
  const handleDeleteEvent = async (id: number) => {
    try {
      const response = await fetch(`/api/Event/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // inventory form based on type
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

  // current view
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
              label="Event Title"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Date/Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={eventForm.startTimestamp}
              onChange={(e) => setEventForm({ ...eventForm, startTimestamp: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Location"
              value={eventForm.location}
              onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
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
                    <TableCell>Title</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.eventId}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{new Date(event.startTimestamp).toLocaleString()}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeleteEvent(event.eventId)} color="error">
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