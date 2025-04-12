import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';

// --- Material UI Imports ---
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Stack,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';

// MUI Icons
import {
  Event as EventIcon,
  Inventory as InventoryIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  ChevronRight,
  ChevronLeft,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// MUI Table Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// MUI X DataGrid
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// MUI X DatePicker
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// --- Custom Imports (your own components) ---
import CreateEvent from './CreateEvent';
import CheckoutHistory from './LiHistSubcomponents/CheckoutHistory';
import DonationHistory from './LiHistSubcomponents/DonationHistory';
import EventHistory from './LiHistSubcomponents/EventHistory';
import FineHistory from './LiHistSubcomponents/FineHistory';
import WaitlistHistory from './LiHistSubcomponents/WaitlistHistory';
import EmployeeProfile from './EmployeeProfile';

// --- Type Definitions ---
interface Item {
  itemId: number;
  title: string;
  availabilityStatus: string;
  totalCopies: number;
  availableCopies: number;
  location?: string;
}

interface EventData {
  eventId: number;
  title: string;
  startTimestamp: string;
  endTimestamp: string;
  location: string;
  ageGroup: number;
  categoryId: number;
  isPrivate: boolean;
  description: string;
}

interface EmployeeData {
  employeeId: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  supervisorID?: number;
  username: string;
  password?: string;
}

interface EditEmployeeDialogProps {
  open: boolean;
  employee: EmployeeData | null;
  onClose: () => void;
  onSave: (updatedData: EmployeeData) => void;
}

const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  open,
  employee,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<EmployeeData>({
    employeeId: 0,
    firstName: '',
    lastName: '',
    birthDate: '',
    username: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Employee Profile</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            fullWidth
          />
          <TextField
            label="Birth Date"
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Example arrays for ageGroups and eventCategories
const ageGroups = [
  { id: 1, label: '0-2' },
  { id: 2, label: '3-8' },
  { id: 3, label: '9-13' },
  { id: 4, label: '14-17' },
  { id: 5, label: '18+' },
];

const eventCategories = [
  { id: 1, label: 'Educational' },
  { id: 2, label: 'Social' },
  { id: 3, label: 'Cultural' },
];

// --- AddEmployeeDialog Component ---
interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void; // Callback to refresh the employees list
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onClose,
  onEmployeeAdded,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Simple password generator function
  const generatePassword = () => {
    const generated = Math.random().toString(36).slice(-8);
    setPassword(generated);
  };

  
  const handleSubmit = async () => {
    const newEmployee = {
      firstName,
      lastName,
      birthDate,
      username,
      password,
    };

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Employee`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEmployee),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add employee.');
      } else {
        alert('Employee added successfully!');
        onEmployeeAdded(); // Refresh employees list
        onClose();
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Network error. Please try again.');
    }
  };

  const clearFields = () => {
    setFirstName('');
    setLastName('');
    setBirthDate('');
    setUsername('');
    setPassword('');
  };

  const handleClose = () => {
    clearFields();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Birth Date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button variant="outlined" onClick={generatePassword}>
              Generate
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// --- EmployeesList Component ---
const EmployeesList: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<EmployeeData | null>(null);
  // Retrieve the logged-in username from localStorage
  const currentUsername = localStorage.getItem("username");
  console.log('Current Username:', currentUsername);
  const handleOpenEditDialog = (employee: EmployeeData) => {
    setEmployeeToEdit(employee);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEmployeeToEdit(null);
    setOpenEditDialog(false);
  };

  const handleUpdateEmployee = async (updatedData: EmployeeData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Employee/${updatedData.employeeId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        }
      );
  
      if (response.ok) {
        // Refresh employee list
        const updatedEmployees = employees.map(e => 
          e.employeeId === updatedData.employeeId ? updatedData : e
        );
        setEmployees(updatedEmployees);
        handleCloseEditDialog();
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // State for controlling the confirmation dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeData | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`);
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Open the confirmation dialog
  const handleOpenConfirmDialog = (employee: EmployeeData) => {
    if (!employee) {
      console.warn("No employee passed to dialog");
      return;
    }
    setEmployeeToDelete(employee);
    setOpenConfirmDialog(true);
  };

  // Close the confirmation dialog
  const handleCloseConfirmDialog = () => {
    setEmployeeToDelete(null);
    setOpenConfirmDialog(false);
  };

  // For now, just log to the console. Implement actual delete call later.
  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    console.log(`DELETE EMPLOYEE with ID: ${employeeToDelete.employeeId}`);

    try{

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Employee/${employeeToDelete.employeeId}`,
        {
          method: 'DELETE',
        }
      );

    

    setOpenConfirmDialog(false);
    setEmployeeToDelete(null);
    window.location.href = "/employee";
    }
  catch(err){
    console.error("Fetch error", err);
  }
};

  const columns: GridColDef[] = [
    { field: 'employeeId', headerName: 'Employee ID', width: 150 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    {
      field: 'birthDate',
      headerName: 'Birth Date',
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: 'username', headerName: 'Username', width: 150 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const row = params.row as EmployeeData;
        const isAdmin = currentUsername === 'admin';
        
        return (
          <Stack direction="row" spacing={1} 
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isAdmin && row.username !== 'admin' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenEditDialog(row)}
                sx={{ 
                  minWidth: 80,
                  py: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                Edit
              </Button>
            )}
            {row.username !== currentUsername && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleOpenConfirmDialog(row)}
                sx={{ 
                  minWidth: 80,
                  py: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                Delete
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h5" gutterBottom>
        Employees List
      </Typography>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid 
          rows={employees}
          getRowId={(row) => row.employeeId}
          columns={columns}
        />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this employee?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <EditEmployeeDialog
      open={openEditDialog}
      employee={employeeToEdit}
      onClose={handleCloseEditDialog}
      onSave={handleUpdateEmployee}
    />
    </Paper>
  );
};



// --- Main Employee Component ---
const Employee: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Extend currentView to include "employees"
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'inventory' | 'events' | 'libraryHistory' | 'profile' | 'employees'
  >('dashboard');

  const [tabValue, setTabValue] = useState(0);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [refreshData, setRefreshData] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);

  // Inventory form
  const [itemForm, setItemForm] = useState<Omit<Item, 'itemId'>>({
    title: '',
    availabilityStatus: 'Available',
    totalCopies: 1,
    availableCopies: 1,
    location: '',
  });

  // Edit item states
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [originalItem, setOriginalItem] = useState<Item | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [openDeleteEventDialog, setOpenDeleteEventDialog] = useState(false);
  const [storedEventIdDeletion, setStoredEventIdDeletion] = useState(-1);
  const [openDeleteItemDialog, setOpenDeleteItemDialog] = useState(false);
  const [storedItemIdDeletion, setStoredItemIdDeletion] = useState(-1);

  // Event edit dialog states
  const [openEditEventDialog, setOpenEditEventDialog] = useState(false);
  const [eventBeingEdited, setEventBeingEdited] = useState<EventData | null>(null);
  const [showEditBlockedDialog, setShowEditBlockedDialog] = useState(false);

  // Add Employee dialog state
  const [openAddEmployeeDialog, setOpenAddEmployeeDialog] = useState(false);

  // --- useEffect: fetch data ---
  useEffect(() => {
    const fetchEmployeeData = async (employeeId: number) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/Employee/${employeeId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch employee data');
        const data = await response.json();
        setEmployeeData({
          employeeId: data.employeeID,
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: data.birthDate,
          supervisorID: data.supervisorID,
          username: data.username,
        });
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setDialogMessage('Failed to fetch employee data. Please try again.');
        setOpenDialog(true);
      }
    };

    const isEmployeeLoggedIn =
      localStorage.getItem('isEmployeeLoggedIn') === 'true';
    const storedEmployeeId = localStorage.getItem('employeeId');

    if (!isEmployeeLoggedIn || !storedEmployeeId) {
      navigate('/employee-login');
      return;
    }

    fetchEmployeeData(parseInt(storedEmployeeId, 10));

    if (currentView === 'inventory' || currentView === 'dashboard' || refreshData) {
      fetchInventory();
    }
    if (currentView === 'events' || currentView === 'dashboard' || refreshData) {
      fetchEvents();
    }
    setRefreshData(false);
  }, [currentView, refreshData, navigate]);

  // --- fetchInventory ---
  const fetchInventory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Item`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setDialogMessage('Failed to fetch inventory. Please try again.');
      setOpenDialog(true);
    }
  };

  // --- fetchEvents ---
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Event`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setDialogMessage('Failed to fetch events. Please try again.');
      setOpenDialog(true);
    }
  };

  // --- Logout ---
  const handleEmployeeLogout = () => {
    localStorage.removeItem('employeeId');
    localStorage.removeItem('isEmployeeLoggedIn');
    localStorage.removeItem('employeeFirstName');
    localStorage.removeItem('employeeLastName');
    navigate('/employee-login');
  };

  // --- Update Employee (Profile) ---
  const handleUpdateEmployee = async (updatedData: EmployeeData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Employee/${updatedData.employeeId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        }
      );
      if (response.ok) {
        setEmployeeData(updatedData);
        setDialogMessage('Profile updated successfully!');
        setOpenDialog(true);
      } else {
        const errorData = await response.json();
        setDialogMessage(errorData.message || 'Failed to update profile.');
        setOpenDialog(true);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      setDialogMessage('Network error. Please try again.');
      setOpenDialog(true);
    }
  };

  // --- Inventory CRUD ---
  const handleAddItem = async () => {
    if (!itemForm.title || !itemForm.availabilityStatus) {
      setDialogMessage('Title and status are required fields.');
      setOpenDialog(true);
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Item`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...itemForm,
            availableCopies: itemForm.totalCopies,
          }),
        }
      );
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
    if (!editingItem || !originalItem) return;
    try {
      const wasZero = originalItem.availableCopies === 0;
      const nowPositive = editingItem.availableCopies > 0;
    {
        // PUT: update item
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/Item/${editingItem.itemId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingItem),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          setDialogMessage(errorData.message || 'Failed to update item.');
          setOpenDialog(true);
        } else {
          setRefreshData(true);
          setOpenEditDialog(false);
          setEditingItem(null);
          setOriginalItem(null);
        }
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setDialogMessage('Network error. Please try again.');
      setOpenDialog(true);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Item/${id}`,
        {
          method: 'DELETE',
        }
      );
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
    setOriginalItem({ ...item });
    setOpenEditDialog(true);
  };

  // --- Event CRUD ---
  const handleDeleteEvent = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Event/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) throw new Error('Failed to delete event');
      setRefreshData(true);
    } catch (error) {
      console.error('Error deleting event:', error);
      setDialogMessage('Failed to delete event. Please try again.');
      setOpenDialog(true);
    }
  };

  const handleEditEvent = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Event/${id}`
      );
      if (!response.ok) throw new Error('Failed to fetch event');
      const eventData: EventData = await response.json();
      const now = dayjs();
      const eventStart = dayjs(eventData.startTimestamp);
      if (eventStart.isBefore(now)) {
        setShowEditBlockedDialog(true);
        return;
      }
      setEventBeingEdited({
        ...eventData,
        startTimestamp: dayjs(eventData.startTimestamp).toISOString(),
        endTimestamp: dayjs(eventData.endTimestamp).toISOString(),
      });
      setOpenEditEventDialog(true);
    } catch (error) {
      console.error('Error getting event:', error);
    }
  };

  const handleRefreshEvents = () => {
    setRefreshData(true);
  };

  // --- Navigation ---
  const views: (
    | 'dashboard'
    | 'inventory'
    | 'events'
    | 'libraryHistory'
    | 'profile'
    | 'employees'
  )[] = [
    'dashboard',
    'inventory',
    'events',
    'libraryHistory',
    'profile',
    'employees',
  ];

  const handleNextView = () => {
    const currentIndex = views.indexOf(currentView);
    const nextIndex = (currentIndex + 1) % views.length;
    setCurrentView(views[nextIndex]);
  };

  const handlePrevView = () => {
    const currentIndex = views.indexOf(currentView);
    const prevIndex = (currentIndex - 1 + views.length) % views.length;
    setCurrentView(views[prevIndex]);
  };

  // --- Layout Helper ---
  const navigationStyles = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1000,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50%',
    boxShadow: theme.shadows[4],
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  };

  // --- Render Library History ---
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

  // --- Render Dashboard ---
  const renderDashboard = () => {
    const dashboardItems = [
      {
        title: 'Inventory',
        count: inventory.length,
        icon: <InventoryIcon fontSize="large" color="primary" />,
        action: () => setCurrentView('inventory'),
        color: theme.palette.primary.main,
      },
      {
        title: 'Events',
        count: events.length,
        icon: <EventIcon fontSize="large" color="secondary" />,
        action: () => setCurrentView('events'),
        color: theme.palette.secondary.main,
      },
      {
        title: 'Library History',
        count: '-',
        icon: (
          <HistoryIcon
            fontSize="large"
            style={{ color: theme.palette.success.main }}
          />
        ),
        action: () => setCurrentView('libraryHistory'),
        color: theme.palette.success.main,
      },
      {
        title: 'My Profile',
        count: '-',
        icon: (
          <PeopleIcon
            fontSize="large"
            style={{ color: theme.palette.info.main }}
          />
        ),
        action: () => setCurrentView('profile'),
        color: theme.palette.info.main,
      },
    ];

    return (
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          marginBottom: 3,
          borderRadius: 4,
          background: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          Employee Dashboard
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                onClick={item.action}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, boxShadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6],
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 500 }}
                    >
                      {item.title}
                    </Typography>
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: item.color,
                      textAlign: 'center',
                      my: 2,
                    }}
                  >
                    {item.count}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    {item.title === 'Inventory'
                      ? 'Items in stock'
                      : item.title === 'Events'
                      ? 'Upcoming events'
                      : item.title === 'My Profile'
                      ? 'View profile'
                      : 'View details'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: theme.palette.grey[100],
            borderRadius: 3,
            borderLeft: `4px solid ${theme.palette.info.main}`,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
              startIcon={<InventoryIcon />}
              onClick={() => setCurrentView('inventory')}
            >
              Add New Item
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size={isMobile ? 'small' : 'medium'}
              startIcon={<EventIcon />}
              onClick={() => setCurrentView('events')}
            >
              Create Event
            </Button>
            <Button
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              startIcon={<HistoryIcon />}
              onClick={() => setCurrentView('libraryHistory')}
            >
              View History
            </Button>
            <Button
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
              startIcon={<PeopleIcon />}
              onClick={() => setCurrentView('profile')}
            >
              View Profile
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  };

  // --- Render Profile ---
  const renderProfile = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {employeeData ? (
        <EmployeeProfile employeeData={employeeData} onUpdate={handleUpdateEmployee} />
      ) : (
        <Typography>No employee data available.</Typography>
      )}
    </Box>
  );

  // --- Render Inventory Management ---
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
            onChange={(e) =>
              setItemForm({
                ...itemForm,
                availabilityStatus: e.target.value as string,
              })
            }
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
                  <IconButton
                    onClick={() => handleEditClick(item)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setStoredItemIdDeletion(item.itemId);
                      setOpenDeleteItemDialog(true);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Item Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {editingItem && (
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Title"
                value={editingItem.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingItem.availabilityStatus}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      availabilityStatus: e.target.value as string,
                    })
                  }
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
                    availableCopies: Math.min(
                      editingItem.availableCopies,
                      total
                    ),
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
                inputProps={{
                  min: 0,
                  max: editingItem.totalCopies,
                }}
              />
              <TextField
                fullWidth
                label="Location"
                value={editingItem.location || ''}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, location: e.target.value })
                }
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateItem} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );

  // --- Render Events ---
  const renderEventManagement = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Event
        </Typography>
        <CreateEvent />
        <Button variant="outlined" onClick={handleRefreshEvents} sx={{ mt: 2 }}>
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.eventId}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>
                    {new Date(event.startTimestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(event.endTimestamp).toLocaleString()}
                  </TableCell>
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
                    <IconButton
                      onClick={() => {
                        setStoredEventIdDeletion(event.eventId);
                        setOpenDeleteEventDialog(true);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditEvent(event.eventId)}
                      color="error"
                    >
                      <EditIcon style={{ color: 'green' }} />
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

  return (
    <Box sx={{ mt: "80px" }}> 
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
          <Button color="inherit" onClick={() => setCurrentView('profile')}>
            My Profile
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 3 }}>
        {/* Admin-only Buttons */}
        {employeeData?.username === 'admin' && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={() => setOpenAddEmployeeDialog(true)}
            >
              Add Employee
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setCurrentView('employees')}
            >
              View Employees
            </Button>
          </Box>
        )}

        {/* AddEmployeeDialog */}
        <AddEmployeeDialog
          open={openAddEmployeeDialog}
          onClose={() => setOpenAddEmployeeDialog(false)}
          onEmployeeAdded={() => {
            setCurrentView('employees');
          }}
        />

        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePrevView}
          sx={{
            ...navigationStyles,
            left: 16,
          }}
        >
          <ChevronLeft fontSize="large" />
        </IconButton>
        <IconButton
          onClick={handleNextView}
          sx={{
            ...navigationStyles,
            right: 16,
          }}
        >
          <ChevronRight fontSize="large" />
        </IconButton>

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

        {/* Event Edit Dialog */}
        <Dialog
          open={openEditEventDialog}
          onClose={() => setOpenEditEventDialog(false)}
          PaperProps={{ sx: { minWidth: 500, minHeight: 350 } }}
        >
          <DialogTitle style={{ fontWeight: 'bold' }}>Edit Event</DialogTitle>
          <DialogContent>
            {eventBeingEdited ? (
              <Stack spacing={2}>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={eventBeingEdited.title}
                    onChange={(e) =>
                      setEventBeingEdited({
                        ...eventBeingEdited,
                        title: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                </Box>
                <TextField
                  label="Location"
                  fullWidth
                  value={eventBeingEdited.location}
                  onChange={(e) =>
                    setEventBeingEdited({
                      ...eventBeingEdited,
                      location: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  value={eventBeingEdited.description}
                  onChange={(e) =>
                    setEventBeingEdited({
                      ...eventBeingEdited,
                      description: e.target.value,
                    })
                  }
                />
                <Stack spacing={2} direction="row">
                  <FormControl fullWidth>
                    <InputLabel>Age Group</InputLabel>
                    <Select
                      value={eventBeingEdited.ageGroup}
                      label="Age Group"
                      onChange={(e) =>
                        setEventBeingEdited({
                          ...eventBeingEdited,
                          ageGroup: Number.parseInt(
                            e.target.value as string
                          ),
                        })
                      }
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
                      value={eventBeingEdited.categoryId}
                      label="Category"
                      onChange={(e) =>
                        setEventBeingEdited({
                          ...eventBeingEdited,
                          categoryId: Number.parseInt(
                            e.target.value as string
                          ),
                        })
                      }
                    >
                      {eventCategories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Private?</InputLabel>
                    <Select
                      value={eventBeingEdited.isPrivate ? 'Yes' : 'No'}
                      label="Private"
                      onChange={(e) =>
                        setEventBeingEdited({
                          ...eventBeingEdited,
                          isPrivate: e.target.value === 'Yes',
                        })
                      }
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={2} direction="row">
                    <DateTimePicker
                      label="Start Time"
                      value={dayjs(eventBeingEdited.startTimestamp)}
                      onChange={(newValue) =>
                        setEventBeingEdited({
                          ...eventBeingEdited,
                          startTimestamp:
                            newValue?.toISOString() || '',
                        })
                      }
                      disablePast
                    />
                    <DateTimePicker
                      label="End Time"
                      value={dayjs(eventBeingEdited.endTimestamp)}
                      onChange={(newValue) =>
                        setEventBeingEdited({
                          ...eventBeingEdited,
                          endTimestamp:
                            newValue?.toISOString() || '',
                        })
                      }
                      disablePast
                    />
                  </Stack>
                </LocalizationProvider>
              </Stack>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Stack direction="row">
              <Button
                onClick={async () => {
                  if (!eventBeingEdited) return;
                  const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/Event/${eventBeingEdited.eventId}`,
                    {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(eventBeingEdited),
                    }
                  );
                  if (response.ok) {
                    setOpenEditEventDialog(false);
                    setRefreshData(true);
                  } else {
                    console.error('Failed to save event update.');
                  }
                }}
                color="primary"
              >
                SAVE
              </Button>
              <Button onClick={() => setOpenEditEventDialog(false)} color="error">
                CANCEL
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
        <Dialog
          open={showEditBlockedDialog}
          onClose={() => setShowEditBlockedDialog(false)}
        >
          <DialogTitle>Cannot Edit Event</DialogTitle>
          <DialogContent>
            <Typography>
              Events cannot be edited after they have started.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditBlockedDialog(false)} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteEventDialog} onClose={() => setOpenDeleteEventDialog(false)}>
  <DialogTitle>Delete Event</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to delete this event? <br />
      <strong>This action is permanent and cannot be undone.</strong>
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteEventDialog(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={() => {
      handleDeleteEvent(storedEventIdDeletion);
      setOpenDeleteEventDialog(false)
      console.log("Delete logic goes here");
    }} color="error" variant="contained">
      Delete
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={openDeleteItemDialog} onClose={() => setOpenDeleteItemDialog(false)}>
  <DialogTitle>Delete Item</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to delete this item? <br />
      <strong>This action is permanent and cannot be undone.</strong>
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteItemDialog(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={() => {
      handleDeleteItem(storedItemIdDeletion);
      setOpenDeleteItemDialog(false);
    }} color="error" variant="contained">
      Delete
    </Button>
  </DialogActions>
</Dialog>


        {/* Render the current view */}
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'inventory' && renderInventoryManagement()}
        {currentView === 'events' && renderEventManagement()}
        {currentView === 'libraryHistory' && renderLibraryHistory()}
        {currentView === 'profile' && renderProfile()}
        {currentView === 'employees' && <EmployeesList />}
      </Container>
    </Box>
  );
};

export default Employee;