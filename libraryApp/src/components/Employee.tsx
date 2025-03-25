import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateEvent from './CreateEvent';
import CheckoutHistory from './LiHistSubcomponents/CheckoutHistory';
import DonationHistory from './LiHistSubcomponents/DonationHistory';
import EventHistory from './LiHistSubcomponents/EventHistory';
import FineHistory from './LiHistSubcomponents/FineHistory';
import WaitlistHistory from './LiHistSubcomponents/WaitlistHistory';

interface Item {
  itemId: number;
  title: string;
  availabilityStatus: string;
  totalCopies: number;
  availableCopies: number;
  location?: string;
}

interface Event {
  eventId: number;
  title: string;
  startTimeStamp: string;
  endTimeStamp: string;
  location: string;
  ageGroup: number;
  categoryId: number;
  isPrivate: boolean;
  description: string;
}

const Employee: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'inventory' | 'events' | 'libraryHistory'>('dashboard');
  const [tabValue, setTabValue] = useState(0);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshData, setRefreshData] = useState(false);

  // Inventory Form States
  const [itemForm, setItemForm] = useState<Omit<Item, 'itemId'>>({
    title: '',
    availabilityStatus: 'Available',
    totalCopies: 1,
    availableCopies: 1,
    location: '',
  });

  // Edit States
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  // Data Fetching
  useEffect(() => {
    if (currentView === 'inventory' || currentView === 'dashboard' || refreshData) {
      fetchInventory();
    }
    if (currentView === 'events' || currentView === 'dashboard' || refreshData) {
      fetchEvents();
    }
    setRefreshData(false);
  }, [currentView, refreshData]);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:5217/api/Item');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setDialogMessage('Failed to fetch inventory. Please try again.');
      setOpenDialog(true);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5217/api/Event');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setDialogMessage('Failed to fetch events. Please try again.');
      setOpenDialog(true);
    }
  };

  // Inventory CRUD Operations
  const handleAddItem = async () => {
    if (!itemForm.title || !itemForm.availabilityStatus) {
      setDialogMessage('Title and status are required fields.');
      setOpenDialog(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5217/api/Item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...itemForm,
          availableCopies: itemForm.totalCopies,
        }),
      });

      if (response.ok) {
        setRefreshData(true);
        setItemForm({
          title: '',
          availabilityStatus: 'Available',
          totalCopies: 1,
          availableCopies: 1,
          location: '',
        });
      } else {
        const errorData = await response.json();
        setDialogMessage(errorData.message || 'Failed to add item.');
        setOpenDialog(true);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setDialogMessage('Network error. Please try again.');
      setOpenDialog(true);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`http://localhost:5217/api/Item/${editingItem.itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        setRefreshData(true);
        setOpenEditDialog(false);
        setEditingItem(null);
      } else {
        const errorData = await response.json();
        setDialogMessage(errorData.message || 'Failed to update item.');
        setOpenDialog(true);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setDialogMessage('Network error. Please try again.');
      setOpenDialog(true);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5217/api/Item/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRefreshData(true);
      } else {
        setDialogMessage('Failed to delete item.');
        setOpenDialog(true);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setDialogMessage('Network error. Please try again.');
      setOpenDialog(true);
    }
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setOpenEditDialog(true);
  };

  // Event Operations
  const handleDeleteEvent = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5217/api/Event/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
      setRefreshData(true);
    } catch (error) {
      console.error('Error deleting event:', error);
      setDialogMessage('Failed to delete event. Please try again.');
      setOpenDialog(true);
    }
  };

  const handleRefreshEvents = () => {
    setRefreshData(true);
  };

  // View Components
  const renderDashboard = () => (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      <Typography>Total Items: {inventory.length}</Typography>
      <Typography>Upcoming Events: {events.length}</Typography>
    </Paper>
  );

  const renderInventoryManagement = () => (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h5" gutterBottom>
        Inventory Management
      </Typography>
      
      {/* Add Item Form */}
      <Box component="form" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Item
        </Typography>
        <TextField
          fullWidth
          label="Title"
          value={itemForm.title}
          onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={itemForm.availabilityStatus}
            onChange={(e) => setItemForm({ ...itemForm, availabilityStatus: e.target.value as string })}
            label="Status"
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Checked Out">Checked Out</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Total Copies"
          type="number"
          value={itemForm.totalCopies}
          onChange={(e) => {
            const total = parseInt(e.target.value) || 0;
            setItemForm({
              ...itemForm,
              totalCopies: total,
              availableCopies: Math.min(itemForm.availableCopies, total),
            });
          }}
          margin="normal"
          inputProps={{ min: 1 }}
        />
        <TextField
          fullWidth
          label="Available Copies"
          type="number"
          value={itemForm.availableCopies}
          onChange={(e) => {
            const available = parseInt(e.target.value) || 0;
            setItemForm({
              ...itemForm,
              availableCopies: Math.min(available, itemForm.totalCopies),
            });
          }}
          margin="normal"
          inputProps={{ min: 0, max: itemForm.totalCopies }}
        />
        <TextField
          fullWidth
          label="Location"
          value={itemForm.location}
          onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
          margin="normal"
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddItem}
          sx={{ mt: 2 }}
        >
          Add Item
        </Button>
      </Box>

      {/* Inventory Table */}
      <Typography variant="h6" gutterBottom>
        Current Inventory
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Copies</TableCell>
              <TableCell>Available Copies</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.availabilityStatus}</TableCell>
                <TableCell>{item.totalCopies}</TableCell>
                <TableCell>{item.availableCopies}</TableCell>
                <TableCell>{item.location || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteItem(item.itemId)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {editingItem && (
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Title"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingItem.availabilityStatus}
                  onChange={(e) => setEditingItem({ ...editingItem, availabilityStatus: e.target.value as string })}
                  label="Status"
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Checked Out">Checked Out</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Lost">Lost</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Total Copies"
                type="number"
                value={editingItem.totalCopies}
                onChange={(e) => {
                  const total = parseInt(e.target.value) || 0;
                  setEditingItem({
                    ...editingItem,
                    totalCopies: total,
                    availableCopies: Math.min(editingItem.availableCopies, total),
                  });
                }}
                margin="normal"
                inputProps={{ min: 1 }}
              />
              <TextField
                fullWidth
                label="Available Copies"
                type="number"
                value={editingItem.availableCopies}
                onChange={(e) => {
                  const available = parseInt(e.target.value) || 0;
                  setEditingItem({
                    ...editingItem,
                    availableCopies: Math.min(available, editingItem.totalCopies),
                  });
                }}
                margin="normal"
                inputProps={{ min: 0, max: editingItem.totalCopies }}
              />
              <TextField
                fullWidth
                label="Location"
                value={editingItem.location || ''}
                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateItem} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );

  const renderEventManagement = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Event
        </Typography>
        <CreateEvent />
        <Button 
          variant="outlined" 
          onClick={handleRefreshEvents}
          sx={{ mt: 2 }}
        >
          Refresh Events List
        </Button>
      </Paper>
      
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Existing Events
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Age Group</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Private</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.eventId}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{new Date(event.startTimeStamp).toLocaleString()}</TableCell>
                  <TableCell>{new Date(event.endTimeStamp).toLocaleString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    {event.ageGroup === 1 && '0-2'}
                    {event.ageGroup === 2 && '3-8'}
                    {event.ageGroup === 3 && '9-13'}
                    {event.ageGroup === 4 && '14-17'}
                    {event.ageGroup === 5 && '18+'}
                  </TableCell>
                  <TableCell>
                    {event.categoryId === 1 && 'Educational'}
                    {event.categoryId === 2 && 'Social'}
                    {event.categoryId === 3 && 'Cultural'}
                  </TableCell>
                  <TableCell>{event.isPrivate ? 'Yes' : 'No'}</TableCell>
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
    </Box>
  );

  const renderLibraryHistory = () => (
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
        {/* Message Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>
            <p>{dialogMessage}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Current View */}
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'inventory' && renderInventoryManagement()}
        {currentView === 'events' && renderEventManagement()}
        {currentView === 'libraryHistory' && renderLibraryHistory()}
      </Container>
    </Box>
  );
};

export default Employee;