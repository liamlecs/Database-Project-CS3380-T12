import type React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import type { SelectChangeEvent } from '@mui/material/Select';
import dayjs from 'dayjs';
import BookForm from './inventory_post_forms/BookForm'; "./inventory_post_forms/BookForm"
import MovieForm from './inventory_post_forms/MovieForm'; "./inventory_post_forms/MovieForm"
import MusicForm from './inventory_post_forms/MusicForm'; // Ensure this path is correct
import TechnologyForm from './inventory_post_forms/TechnologyForm'; // Ensure this path is correct


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
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

// MUI X DatePicker
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// --- Custom Imports ---
import CreateEvent from './CreateEvent';
import CheckoutHistory from './LiHistSubcomponents/CheckoutHistory';
import DonationHistory from './LiHistSubcomponents/DonationHistory';
import EventHistory from './LiHistSubcomponents/EventHistory';
import FineHistory from './LiHistSubcomponents/FineHistory';
import WaitlistHistory from './LiHistSubcomponents/WaitlistHistory';
import EmployeeProfile from './EmployeeProfile';
import ItemFineReport from './Reports/ItemFineReport';

// --- Type Definitions ---
interface Item {
  itemId: number;
  title: string;
  availabilityStatus: string;
  totalCopies: number;
  availableCopies: number;
  location?: string;
}

interface BookDto {
  bookId: number;
  itemId: number;
  itemTypeId: number;
  title: string;
  isbn: string;
  publisher: string;
  genre: string;
  author: string;
  authorFirstName: string;
  authorLastName: string;
  yearPublished: number;
  availableCopies: number;
  totalCopies: number;
  coverImagePath: string;
  itemLocation: string;
  publisherId: number;
  bookGenreId: number;
  bookAuthorId: number;
}

interface MovieDto {
  movieId: number;
  upc: string;
  yearReleased: number;
  format: string;
  coverImagePath: string;
  itemId: number;
  title: string;
  director: string;
  directorFirstName: string;
  directorLastName: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  itemLocation: string;
}

interface MusicDto {
  musicId: number;
  itemId: number;
  itemTypeId: number;
  title: string;
  artistName: string;
  genreDescription: string;
  format: string;
  availableCopies: number;
  totalCopies: number;
  coverImagePath: string;
  location: string
}

interface TechnologyDto {
  deviceId: number;
  itemId: number;
  itemTypeId: number;
  title: string;
  deviceTypeName: string;
  manufacturerName: string;
  modelNumber: string;
  availableCopies: number;
  totalCopies: number;
  coverImagePath: string;
  location: string;
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

// -- state of selected item type
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
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            fullWidth
          />
          <TextField
            label="Birth Date"
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
      // API Endpoint
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
  // console.log('Current Username:', currentUsername);
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
    // console.log(`DELETE EMPLOYEE with ID: ${employeeToDelete.employeeId}`);

    try {

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
    catch (err) {
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
      renderCell: (params) => dayjs(params.value).format("MM/DD/YYYY"),
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
  const [publishers, setPublishers] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  // State for new entries when "Other" is selected:
  const [newPublisherName, setNewPublisherName] = useState("");
  const [newAuthorFirstName, setNewAuthorFirstName] = useState("");
  const [newAuthorLastName, setNewAuthorLastName] = useState("");

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [genreRes, authorRes, publisherRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookGenre`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookAuthor`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Publisher`)
        ]);

        if (!genreRes.ok || !authorRes.ok || !publisherRes.ok) {
          throw new Error("Failed to fetch dropdown options");
        }

        const [genreData, authorData, publisherData] = await Promise.all([
          genreRes.json(),
          authorRes.json(),
          publisherRes.json()
        ]);

        // console.log("Publishers:", publisherData); // Check the output
        // console.log("Genres:", genreData); // Check the output
        // console.log("Authors:", authorData); // Check the output

        setGenres(genreData);
        setAuthors(authorData);
        setPublishers(publisherData);
      } catch (err) {
        console.error("Dropdown fetch error:", err);
      }
    };

    fetchDropdownData();
  }, []);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedItemType, setSelectedItemType] = useState("Book");
  const handleItemTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedItemType(event.target.value);
  };

  // Extend currentView to include "employees"
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'inventory' | 'events' | 'libraryHistory' | 'profile' | 'employees'
  >('dashboard');

  const [tabValue, setTabValue] = useState(0);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [bookInventory, setBookInventory] = useState<BookDto[]>([]);
  const [movieInventory, setMovieInventory] = useState<MovieDto[]>([]);
  const [musicInventory, setMusicInventory] = useState<MusicDto[]>([]);
  const [technologyInventory, setTechnologyInventory] = useState<TechnologyDto[]>([]);
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

  // Book
  const [editingBook, setEditingBook] = useState<BookDto | null>(null);
  const [editBookForm, setEditBookForm] = useState<Partial<BookDto>>({})
  const [openEditBookDialog, setOpenEditBookDialog] = useState(false);
  const openEditBook = (b: BookDto) => {
    setEditingBook(b);
    setEditBookForm({
      title: b.title,
      isbn: b.isbn,
      bookAuthorId: authors.find((a) => a.firstName === b.authorFirstName && a.lastName === b.authorLastName)?.bookAuthorId,
      publisherId: publishers.find((p) => p.publisherName === b.publisher)?.publisherId,
      bookGenreId: genres.find((g) => g.description === b.genre)?.bookGenreId,
      author: authors.find((a) => a.firstName === b.authorFirstName && a.lastName === b.authorLastName)?.bookAuthorId || "",
      authorFirstName: authors.find((a) => a.firstName === b.authorFirstName)?.bookAuthorId || "",
      authorLastName: authors.find((a) => a.lastName === b.authorLastName)?.bookAuthorId || "",
      publisher: publishers.find((p) => p.publisherName === b.publisher)?.publisherId || "",
      genre: genres.find((g) => g.description === b.genre)?.bookGenreId || "",
      yearPublished: b.yearPublished,
      totalCopies: b.totalCopies,
      availableCopies: b.availableCopies,
      itemLocation: b.itemLocation,
      coverImagePath: b.coverImagePath
    })
    setOpenEditBookDialog(true);
  };

  const handleSaveEditBook = async () => {
    if (!editingBook) return;

    // 1. Figure out the author ID 
    let finalAuthorID: number;
    if (editBookForm.author === "other") {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookAuthor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newAuthorFirstName,
          lastName: newAuthorLastName
        })
      });
      const created = await resp.json();
      finalAuthorID = created.bookAuthorId;
    } else {
      finalAuthorID = Number(editBookForm.author);
    }

    // 2. figure out the publisher ID
    let finalPublisherID: number;
    if (editBookForm.publisher === "other") {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Publisher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publisherName: newPublisherName })
      });
      const created = await resp.json();
      finalPublisherID = created.publisherId;
    } else {
      finalPublisherID = Number(editBookForm.publisher);
    }

    const payload = {
      title: editBookForm.title,
      isbn: editBookForm.isbn,
      publisherID: finalPublisherID,
      bookGenreID: Number(editBookForm.genre!),
      bookAuthorID: finalAuthorID,
      yearPublished: Number(editBookForm.yearPublished!),
      coverImagePath: editBookForm.coverImagePath,
      totalCopies: Number(editBookForm.totalCopies!),
      availableCopies: Number(editBookForm.availableCopies!),
      location: editBookForm.itemLocation,
      itemTypeID: 1 // default
    };

    console.log("Final payload:", payload);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Book/edit-book/${editingBook.bookId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setOpenEditBookDialog(false);
        setNewAuthorFirstName("");
        setNewAuthorLastName("");
        setNewPublisherName("");
        setRefreshData(true); // re‑fetch your lists
      } else {
        console.error('Failed to save edits:', await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Movie
  const [editingMovie, setEditingMovie] = useState<MovieDto | null>(null);
  const [openEditMovieDialog, setOpenEditMovieDialog] = useState(false);
  const [editMovieForm, setEditMovieForm] = useState<Partial<MovieDto>>({});
  const [directors, setDirectors] = useState<any[]>([]);
  const [movieGenres, setMovieGenres] = useState<any[]>([]);
  const openEditMovie = (m: MovieDto) => {
    console.log("Opening movie:", m); // for debugging
    setEditingMovie(m);
    setEditMovieForm({
      title: m.title,
      upc: m.upc,
      director: m.director,
      directorFirstName: m.directorFirstName,
      directorLastName: m.directorLastName,
      genre: m.genre,
      format: m.format,
      yearReleased: m.yearReleased,
      totalCopies: m.totalCopies,
      availableCopies: m.availableCopies,
      itemLocation: m.itemLocation,
      coverImagePath: m.coverImagePath,
    });
    setOpenEditMovieDialog(true);
  };
  useEffect(() => {
    const fetchMovieDropdownData = async () => {
      try {
        const [directorRes, genreRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MovieDirector`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MovieGenre`),
        ]);

        if (!directorRes.ok || !genreRes.ok) throw new Error("Failed to fetch movie dropdowns");

        const [directorData, genreData] = await Promise.all([
          directorRes.json(),
          genreRes.json(),
        ]);

        setDirectors(directorData);
        setMovieGenres(genreData);
      } catch (err) {
        console.error("Dropdown fetch error (Movie):", err);
      }
    };

    fetchMovieDropdownData();
  }, []);

  const handleSaveEditMovie = async () => {
    if (!editingMovie) return;

    const selectedDirector = directors.find(
      (d) =>
        d.firstName === editMovieForm.directorFirstName &&
        d.lastName === editMovieForm.directorLastName
    );

    const movieDirectorID = selectedDirector?.movieDirectorId || 1;

    const selectedGenre = movieGenres.find(
      (g) => g.description === editMovieForm.genre
    );

    const movieGenreID = selectedGenre?.movieGenreId || 1;

    const payload = {
      title: editMovieForm.title,
      upc: editMovieForm.upc,
      movieDirectorID,
      movieGenreID,
      yearReleased: Number(editMovieForm.yearReleased),
      format: editMovieForm.format,
      coverImagePath: editMovieForm.coverImagePath || '',
      totalCopies: Number(editMovieForm.totalCopies),
      availableCopies: Number(editMovieForm.availableCopies),
      location: editMovieForm.itemLocation || '',
      itemTypeID: 2, // movie item type id
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Movie/${editingMovie.movieId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setOpenEditMovieDialog(false);
        setRefreshData(true);
      } else {
        const err = await res.text();
        console.error("Failed to save edits:", err);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Music
  const [editingMusic, setEditingMusic] = useState<MusicDto | null>(null);
  const [openEditMusicDialog, setOpenEditMusicDialog] = useState(false);
  const openEditMusic = (m: MusicDto) => {
    setEditingMusic(m);
    setOpenEditMusicDialog(true);
  };

  // Technology
  const [editingTech, setEditingTech] = useState<TechnologyDto | null>(null);
  const [openEditTechDialog, setOpenEditTechDialog] = useState(false);
  const openEditTech = (t: TechnologyDto) => {
    setEditingTech(t);
    setOpenEditTechDialog(true);
  };

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
      navigate('/login');
      return;
    }

    fetchEmployeeData(parseInt(storedEmployeeId, 10));

    if (currentView === 'inventory' || currentView === 'dashboard' || refreshData) {
      fetchInventory();
      fetchBookInventory();
      fetchMovieInventory();
      fetchMusicInventory();
      fetchTechnologyInventory();
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

  // -- fetchBookInventory --
  const fetchBookInventory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Book`);
      if (!response.ok) throw new Error('Failed to fetch book inventory');
      const data = await response.json();
      setBookInventory(data);
    } catch (error) {
      console.error('Error fetching book inventory:', error);
      setDialogMessage('Failed to fetch book inventory. Please try again.');
      setOpenDialog(true);
    }
    // console.log('Book Inventory:', bookInventory);
  };

  // -- fetchMovieInventory --
  const fetchMovieInventory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movie`);
      if (!response.ok) throw new Error('Failed to fetch movie inventory');
      const data = await response.json();
      setMovieInventory(data);
    } catch (error) {
      console.error('Error fetching movie inventory:', error);
      setDialogMessage('Failed to fetch movie inventory. Please try again.');
      setOpenDialog(true);
    }
    // console.log('Movie Inventory:', movieInventory);
  };

  // -- fetchMusicInventory --
  const fetchMusicInventory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Music`);
      if (!response.ok) throw new Error('Failed to fetch music inventory');
      const data = await response.json();
      setMusicInventory(data);
    } catch (error) {
      console.error('Error fetching music inventory:', error);
      setDialogMessage('Failed to fetch music inventory. Please try again.');
      setOpenDialog(true);
    }
    // console.log('Music Inventory:', musicInventory);
  };

  // -- fetchTechnologyInventory --
  const fetchTechnologyInventory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Technology`);
      if (!response.ok) throw new Error('Failed to fetch technology inventory');
      const data = await response.json();
      setTechnologyInventory(data);
    } catch (error) {
      console.error('Error fetching technology inventory:', error);
      setDialogMessage('Failed to fetch technology inventory. Please try again.');
      setOpenDialog(true);
    }
    // console.log('Technology Inventory:', technologyInventory);
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
    navigate('/login');
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
        startTimestamp: dayjs(eventData.startTimestamp).format("YYYY-MM-DDTHH:mm"),
        endTimestamp: dayjs(eventData.endTimestamp).format("YYYY-MM-DDTHH:mm"),
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
      <Typography variant="h5" align="center" gutterBottom>
        Library History
      </Typography>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        {/* <Tab label="Checkout History" /> */}
        <Tab label="Donation History" />
        <Tab label="Event History" />
        {/* <Tab label="Fine History" /> */}
        <Tab label="Waitlist History" />
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {/* {tabValue === 0 && <CheckoutHistory />} */}
        {tabValue === 0 && <DonationHistory />}
        {tabValue === 1 && <EventHistory />}
        {/* {tabValue === 3 && <FineHistory />} */}
        {tabValue === 2 && <WaitlistHistory />}
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
            justifyContent: 'center',
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

  const renderInventoryManagementTest = () => (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Inventory Management
      </Typography>

      {/* Item Type Selection Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="item-type-label">Item Type</InputLabel>
        <Select
          labelId="item-type-label"
          value={selectedItemType}
          label="Item Type"
          onChange={handleItemTypeChange}
        >
          <MenuItem value="Book">Book</MenuItem>
          <MenuItem value="Movie">Movie</MenuItem>
          <MenuItem value="Music">Music</MenuItem>
          <MenuItem value="Technology">Technology</MenuItem>
        </Select>
      </FormControl>

      {/* Dynamically Render Form */}
      <Box sx={{ mb: 4 }}>
        {selectedItemType === "Book" && <BookForm />}
        {selectedItemType === "Movie" && <MovieForm />}
        {selectedItemType === "Music" && <MusicForm />}
        {selectedItemType === "Technology" && <TechnologyForm />}
      </Box>


      {/* Add Item Form */}
      <Box component="form" sx={{ mb: 3 }}>

      </Box>

      {/* --- Current Books --- */}
      <Typography variant="h6" sx={{ mt: 2 }}>Current Books</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Author First Name</TableCell>
              <TableCell>Author Last Name</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Year Published</TableCell>
              <TableCell>Total Copies</TableCell>
              <TableCell>Available Copies</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookInventory.map(b => (
              <TableRow key={b.bookId}>
                <TableCell>
                  <img src={b.coverImagePath} alt={b.title} style={{ width: 50, height: 75 }} />
                </TableCell>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>{b.authorFirstName}</TableCell>
                <TableCell>{b.authorLastName}</TableCell>
                <TableCell>{b.publisher}</TableCell>
                <TableCell>{b.genre}</TableCell>
                <TableCell>{b.yearPublished}</TableCell>
                <TableCell>{b.totalCopies}</TableCell>
                <TableCell>{b.availableCopies}</TableCell>
                <TableCell>{b.itemLocation}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => openEditBook(b)}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        /* your delete handler */
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Current Movies --- */}
      <Typography variant="h6" sx={{ mt: 2 }}>Current Movies</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>UPC</TableCell>
              <TableCell>Director First Name</TableCell>
              <TableCell>Director Last Name</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Total Copies</TableCell>
              <TableCell>Available Copies</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movieInventory.map(m => (
              <TableRow key={m.movieId}>
                <TableCell>
                  <img src={m.coverImagePath} alt={m.title} style={{ width: 50, height: 75 }} />
                </TableCell>
                <TableCell>{m.title}</TableCell>
                <TableCell>{m.upc}</TableCell>
                <TableCell>{m.directorFirstName}</TableCell>
                <TableCell>{m.directorLastName}</TableCell>
                <TableCell>{m.genre}</TableCell>
                <TableCell>{m.yearReleased}</TableCell>
                <TableCell>{m.format}</TableCell>
                <TableCell>{m.totalCopies}</TableCell>
                <TableCell>{m.availableCopies}</TableCell>
                <TableCell>{m.itemLocation}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => openEditMovie(m)}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        /* your delete handler */
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Current Music --- */}
      <Typography variant="h6" sx={{ mt: 2 }}>Current Music</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Format</TableCell>
              <TableCell>Total Copies</TableCell>
              <TableCell>Available Copies</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {musicInventory.map(m => (
              <TableRow key={m.musicId}>
                <TableCell>
                  <img src={m.coverImagePath} alt={m.title} style={{ width: 50, height: 50 }} />
                </TableCell>
                <TableCell>{m.title}</TableCell>
                <TableCell>{m.artistName}</TableCell>
                <TableCell>{m.genreDescription}</TableCell>
                <TableCell>{m.format}</TableCell>
                <TableCell>{m.totalCopies}</TableCell>
                <TableCell>{m.availableCopies}</TableCell>
                <TableCell>{m.location}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => openEditMusic(m)}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        /* your delete handler */
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Current Technology --- */}
      <Typography variant="h6" sx={{ mt: 2 }}>Current Technology</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Device Type</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Model Number</TableCell>
              <TableCell>Total Copies</TableCell>
              <TableCell>Available Copies</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {technologyInventory.map(t => (
              <TableRow key={t.deviceId}>
                <TableCell>
                  <img src={t.coverImagePath} alt={t.title} style={{ width: 50, height: 50 }} />
                </TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.deviceTypeName}</TableCell>
                <TableCell>{t.manufacturerName}</TableCell>
                <TableCell>{t.modelNumber}</TableCell>
                <TableCell>{t.totalCopies}</TableCell>
                <TableCell>{t.availableCopies}</TableCell>
                <TableCell>{t.location}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => openEditTech(t)}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        /* your delete handler */
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  // --- Render Inventory Management ---
  const renderInventoryManagement = () => (

    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>

      <Typography variant="h5" align="center" gutterBottom>
        Inventory Management
      </Typography>

      {/* Item Type Selection Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="item-type-label">Item Type</InputLabel>
        <Select
          labelId="item-type-label"
          value={selectedItemType}
          label="Item Type"
          onChange={handleItemTypeChange}
        >
          <MenuItem value="Book">Book</MenuItem>
          <MenuItem value="Movie">Movie</MenuItem>
          <MenuItem value="Music">Music</MenuItem>
          <MenuItem value="Technology">Technology</MenuItem>
        </Select>
      </FormControl>

      {/* Dynamically Render Form */}
      <Box sx={{ mb: 4 }}>
        {selectedItemType === "Book" && <BookForm />}
        {selectedItemType === "Movie" && <MovieForm />}
        {selectedItemType === "Music" && <MusicForm />}
        {selectedItemType === "Technology" && <TechnologyForm />}
      </Box>


      {/* Add Item Form */}
      <Box component="form" sx={{ mb: 3 }}>

      </Box>



      <Typography variant="h6" gutterBottom>
        Current Inventory
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          {/* Add table rows and cells here */}
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
                    onClick={() => {
                      // console.log(item);
                      handleEditClick(item);
                      setOpenEditDialog(true);
                      // setStoredItemIdDeletion(item.itemId);
                      // setOpenDeleteItemDialog(true);
                    }

                    }
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

      {/* Edit Item Dialog - Add this section */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="md">
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


              <TextField
                fullWidth
                type="number"
                label="Total Copies"
                value={editingItem.totalCopies}
                onChange={(e) => {
                  const total = parseInt(e.target.value) || 0;
                  setEditingItem({
                    ...editingItem,
                    totalCopies: total,
                    availableCopies: Math.min(editingItem.availableCopies, total)
                  });
                }}
                margin="normal"
                inputProps={{ min: 1 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Available Copies"
                value={editingItem.availableCopies}
                onChange={(e) => {
                  const available = parseInt(e.target.value) || 0;
                  setEditingItem({
                    ...editingItem,
                    availableCopies: Math.min(available, editingItem.totalCopies)
                  });
                }}
                margin="normal"
                inputProps={{
                  min: 0,
                  max: editingItem.totalCopies
                }}
              />

              <TextField
                fullWidth
                label="Location"
                value={editingItem.location || ''}
                onChange={(e) => setEditingItem({
                  ...editingItem,
                  location: e.target.value
                })}
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
        <Typography variant="h5" align="center" gutterBottom >
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
                    {dayjs(event.startTimestamp).format("MM/DD/YYYY hh:mm A")}
                  </TableCell>
                  <TableCell>
                    {dayjs(event.endTimestamp).format("MM/DD/YYYY hh:mm A")}
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
                            newValue?.format("YYYY-MM-DDTHH:mm") || '',

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
                            newValue?.format("YYYY-MM-DDTHH:mm") || '',
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
                disabled={
                  !eventBeingEdited ||
                  dayjs(eventBeingEdited.startTimestamp).isAfter(dayjs(eventBeingEdited.endTimestamp))
                }
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
              // console.log("Delete logic goes here");
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

        <Dialog
          open={openEditBookDialog}
          onClose={() => setOpenEditBookDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Edit Book</DialogTitle>
          <DialogContent>
            {editingBook && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label="Title"
                  fullWidth
                  value={editBookForm.title || ''}
                  onChange={e =>
                    setEditBookForm(f => ({ ...f, title: e.target.value }))
                  }
                />
                <TextField
                  label="ISBN"
                  fullWidth
                  value={editBookForm.isbn || ''}
                  onChange={e =>
                    setEditBookForm(f => ({ ...f, isbn: e.target.value }))
                  }
                />
                {/* — Author Select with ‘Other’ — */}
                <FormControl fullWidth>
                  <InputLabel>Author</InputLabel>
                  <Select
                    value={
                      editBookForm.author || "other"
                    }
                    label="Author"
                    onChange={e => {
                      const v = e.target.value as string;
                      console.log("Selected Value:", v); // Log the selected value
                      if (v === "other") {
                        setEditBookForm(f => ({
                          ...f,
                          author: "other",
                          authorFirstName: "",
                          authorLastName: ""
                        }));
                      } else {
                        const selectedAuthor = authors.find((a) => a.bookAuthorId === Number(v));
                        if (selectedAuthor) {
                          setEditBookForm((f) => ({
                            ...f,
                            author: selectedAuthor.bookAuthorId.toString(), // Set the `author` to the `bookAuthorId`
                            authorFirstName: selectedAuthor.firstName,
                            authorLastName: selectedAuthor.lastName,
                          }));
                        }
                      }
                    }}
                  >
                    {authors.map(a => (
                      <MenuItem key={a.bookAuthorId} value={a.bookAuthorId}>
                        {a.firstName} {a.lastName}
                      </MenuItem>
                    ))}
                    <MenuItem value="other">Other…</MenuItem>
                  </Select>
                </FormControl>
                {!editBookForm.authorFirstName && !editBookForm.authorLastName && (
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="New Author First Name"
                      value={newAuthorFirstName}
                      onChange={e => setNewAuthorFirstName(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="New Author Last Name"
                      value={newAuthorLastName}
                      onChange={e => setNewAuthorLastName(e.target.value)}
                      fullWidth
                    />
                  </Stack>
                )}

                {/* — Genre Select — */}
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={editBookForm.genre || ""}
                    label="Genre"
                    onChange={e => {
                      const genreId = e.target.value as string; // Get the selected GenreID
                      console.log("Selected GenreID:", genreId); // Log the GenreID
                      setEditBookForm(f => ({ ...f, genre: genreId }));
                    }}
                  >
                    {genres.map(g => (
                      <MenuItem key={g.bookGenreId} value={g.bookGenreId}>
                        {g.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* — Publisher Select with ‘Other’ — */}
                <FormControl fullWidth>
                  <InputLabel>Publisher</InputLabel>
                  <Select
                    value={editBookForm.publisher || "other"}
                    label="Publisher"
                    onChange={e => {
                      const v = e.target.value as string;
                      console.log("Selected Value:", v); // Log the selected value
                      if (v === "other") {
                        setEditBookForm(f => ({ ...f, publisher: "other" }));
                      } else {
                        setEditBookForm(f => ({ ...f, publisher: v }));
                      }
                    }}
                  >
                    {publishers.map(p => (
                      <MenuItem key={p.publisherId} value={p.publisherId}>
                        {p.publisherName}
                      </MenuItem>
                    ))}
                    <MenuItem value="other">Other…</MenuItem>
                  </Select>
                </FormControl>
                {editBookForm.publisher === "other" && (
                  <TextField
                    label="New Publisher"
                    value={newPublisherName}
                    onChange={e => setNewPublisherName(e.target.value)}
                    fullWidth
                  />
                )}
                <TextField
                  label="Year Published"
                  type="number"
                  fullWidth
                  value={editBookForm.yearPublished ?? ''}
                  onChange={e =>
                    setEditBookForm(f => ({
                      ...f,
                      yearPublished: Number(e.target.value),
                    }))
                  }
                />
                <TextField
                  label="Total Copies"
                  type="number"
                  fullWidth
                  value={editBookForm.totalCopies ?? ''}
                  onChange={e =>
                    setEditBookForm(f => ({
                      ...f,
                      totalCopies: Number(e.target.value),
                    }))
                  }
                />
                <TextField
                  label="Available Copies"
                  type="number"
                  fullWidth
                  value={editBookForm.availableCopies ?? ''}
                  onChange={e =>
                    setEditBookForm(f => ({
                      ...f,
                      availableCopies: Number(e.target.value),
                    }))
                  }
                />
                <TextField
                  label="Location"
                  fullWidth
                  value={editBookForm.itemLocation || ''}
                  onChange={e =>
                    setEditBookForm(f => ({ ...f, itemLocation: e.target.value }))
                  }
                />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Cover Image
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* preview */}
                    {editBookForm.coverImagePath && (
                      <img
                        src={editBookForm.coverImagePath}
                        alt="cover preview"
                        style={{ width: 50, height: 75, objectFit: 'cover' }}
                      />
                    )}
                    {/* file picker */}
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                    >
                      Choose Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const form = new FormData();
                          form.append('Cover', file);
                          try {
                            const resp = await fetch(
                              `${import.meta.env.VITE_API_BASE_URL}/api/Book/upload-cover`,
                              { method: 'POST', body: form }
                            );
                            const { url } = await resp.json();
                            setEditBookForm(f => ({ ...f, coverImagePath: url }));
                          } catch (err) {
                            console.error('Upload failed', err);
                          }
                        }}
                      />
                    </Button>
                  </Box>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditBookDialog(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSaveEditBook}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditMovieDialog} onClose={() => setOpenEditMovieDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>Edit Movie</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField label="Title" fullWidth value={editMovieForm.title || ""} onChange={e => setEditMovieForm(f => ({ ...f, title: e.target.value }))} />
              <TextField label="UPC" fullWidth value={editMovieForm.upc || ""} onChange={e => setEditMovieForm(f => ({ ...f, upc: e.target.value }))} />
              <TextField label="Director First Name" fullWidth value={editMovieForm.directorFirstName || ""} onChange={e => setEditMovieForm(f => ({ ...f, directorFirstName: e.target.value }))} />
              <TextField label="Director Last Name" fullWidth value={editMovieForm.directorLastName || ""} onChange={e => setEditMovieForm(f => ({ ...f, directorLastName: e.target.value }))} />
              <TextField label="Genre" fullWidth value={editMovieForm.genre || ""} onChange={e => setEditMovieForm(f => ({ ...f, genre: e.target.value }))} />
              <TextField label="Format" fullWidth value={editMovieForm.format || ""} onChange={e => setEditMovieForm(f => ({ ...f, format: e.target.value }))} />
              <TextField label="Year Released" type="number" fullWidth value={editMovieForm.yearReleased ?? ""} onChange={e => setEditMovieForm(f => ({ ...f, yearReleased: Number(e.target.value) }))} />
              <TextField label="Total Copies" type="number" fullWidth value={editMovieForm.totalCopies ?? ""} onChange={e => setEditMovieForm(f => ({ ...f, totalCopies: Number(e.target.value) }))} />
              <TextField label="Available Copies" type="number" fullWidth value={editMovieForm.availableCopies ?? ""} onChange={e => setEditMovieForm(f => ({ ...f, availableCopies: Number(e.target.value) }))} />
              <TextField label="Location" fullWidth value={editMovieForm.itemLocation || ""} onChange={e => setEditMovieForm(f => ({ ...f, location: e.target.value }))} />
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Cover Image
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* preview */}
                  {editMovieForm.coverImagePath && (
                    <img
                      src={editMovieForm.coverImagePath}
                      alt="cover preview"
                      style={{ width: 50, height: 75, objectFit: 'cover' }}
                    />
                  )}
                  {/* file picker */}
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                  >
                    Choose Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append('Cover', file);
                        try {
                          const resp = await fetch(
                            `${import.meta.env.VITE_API_BASE_URL}/api/Movie/upload-cover`,
                            { method: 'POST', body: form }
                          );
                          const { url } = await resp.json();
                          setEditMovieForm(f => ({ ...f, coverImagePath: url }));
                        } catch (err) {
                          console.error('Upload failed', err);
                        }
                      }}
                    />
                  </Button>
                </Box>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditMovieDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEditMovie} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>


        {/* Render the current view */}
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'inventory' && renderInventoryManagementTest()}
        {currentView === 'events' && renderEventManagement()}
        {currentView === 'libraryHistory' && renderLibraryHistory()}
        {currentView === 'profile' && renderProfile()}
        {currentView === 'employees' && <EmployeesList />}
      </Container>
    </Box>
  );
};

export default Employee;