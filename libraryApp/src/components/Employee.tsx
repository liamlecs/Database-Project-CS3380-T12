import type React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import type { SelectChangeEvent } from '@mui/material/Select';
import dayjs from 'dayjs';
import BookForm from './inventory_post_forms/BookForm'; "./inventory_post_forms/BookForm"
import MovieForm from './inventory_post_forms/MovieForm'; "./inventory_post_forms/MovieForm"
import MusicForm from './inventory_post_forms/MusicForm'; // Ensure this path is correct
import TechnologyForm from './inventory_post_forms/TechnologyForm'; // Ensure this path is correct
import CurrentBooks from './CurrentInventory/CurrentBook'; // Ensure this path is correct
import CurrentMovies from './CurrentInventory/CurrentMovie'; // Ensure this path is correct
import CurrentMusic from './CurrentInventory/CurrentMusic'; // Ensure this path is correct
import CurrentTechnology from './CurrentInventory/CurrentTechnology'; // Ensure this path is correct
import EditBookDialog from './EditDialog/EditBookDialog.tsx';
import EditMovieDialog from './EditDialog/EditMovieDialog.tsx';
import EditMusicDialog from './EditDialog/EditMusicDialog.tsx';

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


import type { BookDto } from '../types.ts';
import type { MovieDto } from '../types.ts';
import type { MusicDto } from '../types.ts';
import type { TechnologyDto } from '../types.ts';
import type { Item } from '../types.ts';
import type { EventData } from '../types.ts';
import type { EmployeeData } from '../types.ts';
import type { EditEmployeeDialogProps } from '../types.ts';


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
      // Refresh the authors list
      const updatedAuthors = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookAuthor`).then((res) => res.json());
      setAuthors(updatedAuthors);
      // Update the state with the new author's ID
      setEditBookForm((f) => ({
        ...f,
        author: finalAuthorID.toString(),
        authorFirstName: newAuthorFirstName,
        authorLastName: newAuthorLastName,
      }));
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
      // Refresh the publishers list
      const updatedPublishers = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Publisher`).then((res) => res.json());
      setPublishers(updatedPublishers);
      // Update the state with the new publisher's ID
      setEditBookForm((f) => ({
        ...f,
        publisher: finalPublisherID.toString(),
        publisherName: newPublisherName,
      }));
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
  const [newDirectorFirstName, setNewDirectorFirstName] = useState("");
  const [newDirectorLastName, setNewDirectorLastName] = useState("");

  const openEditMovie = (m: MovieDto) => {
    // console.log("Opening movie:", m); // for debugging
    setEditingMovie(m);
    setEditMovieForm({
      title: m.title,
      upc: m.upc,
      movieDirectorId: directors.find((d) => d.firstName === m.directorFirstName && d.lastName === m.directorLastName)?.movieDirectorId,
      movieGenreId: movieGenres.find((g) => g.description === m.genre)?.movieGenreId,
      director: directors.find((d) => d.firstName === m.directorFirstName && d.lastName === m.directorLastName)?.movieDirectorId || "",
      directorFirstName: directors.find((d) => d.firstName === m.directorFirstName)?.movieDirectorId || "",
      directorLastName: directors.find((d) => d.lastName === m.directorLastName)?.movieDirectorId || "",
      genre: movieGenres.find((g) => g.description === m.genre)?.movieGenreId || "",
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

    let finalDirectorID: number;
    if (editMovieForm.director === "other") {
      const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MovieDirector`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newDirectorFirstName,
          lastName: newDirectorLastName
        })
      });
      const created = await resp.json();
      finalDirectorID = created.movieDirectorId;
      // Refresh the directors list
      const updatedDirectors = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MovieDirector`).then((res) => res.json());
      setDirectors(updatedDirectors);
      // Update the state with the new director's ID
      setEditMovieForm((f) => ({
        ...f,
        director: finalDirectorID.toString(),
        directorFirstName: newDirectorFirstName,
        directorLastName: newDirectorLastName,
      }));
    } else {
      finalDirectorID = Number(editMovieForm.director);
    }

    const selectedGenre = movieGenres.find(
      (g) => g.description === editMovieForm.genre
    );

    const movieGenreID = selectedGenre?.movieGenreId || 1;

    const payload = {
      title: editMovieForm.title,
      upc: editMovieForm.upc,
      movieDirectorID: finalDirectorID,
      movieGenreID: Number(editMovieForm.genre!),
      yearReleased: Number(editMovieForm.yearReleased!),
      format: editMovieForm.format,
      coverImagePath: editMovieForm.coverImagePath,
      totalCopies: Number(editMovieForm.totalCopies!),
      availableCopies: Number(editMovieForm.availableCopies!),
      location: editMovieForm.itemLocation,
      itemTypeID: 2, // Movie
    };

    console.log("Final payload:", payload);

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
        setNewDirectorFirstName("");
        setNewDirectorLastName("");
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
  const [editMusicForm, setEditMusicForm] = useState<Partial<MusicDto>>({});
  const [openEditMusicDialog, setOpenEditMusicDialog] = useState(false);
  const openEditMusic = (m: MusicDto) => {
    setEditingMusic(m);
    setEditMusicForm ({
      title: m.title,
      musicArtistId: artists.find((a) => a.artistName === m.artistName)?.musicArtistId,
      musicGenreId: musicGenres.find((g) => g.description === m.genreDescription)?.musicGenreId,
      artistName: artists.find((a) => a.artistName === m.artistName)?.musicArtistId || "",
      genreDescription: musicGenres.find((g) => g.description === m.genreDescription)?.musicGenreId || "",
      format: m.format,
      availableCopies: m.availableCopies,
      totalCopies: m.totalCopies,
      coverImagePath: m.coverImagePath,
      location: m.location,
    })
    setOpenEditMusicDialog(true);
  };

  const [artists, setArtists] = useState<any[]>([]);
  const [musicGenres, setMusicGenres] = useState<any[]>([]);
  
  const [newArtistName, setNewArtistName] = useState(""); // Single field for artist name
  
    useEffect(() => {
      const fetchDropdownData = async () => {
        try {
          const [artistRes, genreRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MusicArtist`),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MusicGenre`),
          ]);
  
          if (!artistRes.ok || !genreRes.ok) {
            throw new Error("Failed to fetch dropdown options");
          }
  
          const artistData = await artistRes.json();
          const genreData = await genreRes.json();
  
          //See what backend is returning
          //console.log("Artist data:", artistData);
          //console.log("Genre data:", genreData);
  
          setArtists(artistData);
          setMusicGenres(genreData);
        } catch (err) {
          console.error("Dropdown fetch error:", err);
        }
      };
  
      fetchDropdownData();
    }, []);

    const handleSaveEditMusic = async () => {
      if (!editingMusic) return;

      console.log("Editing Music ID:", editingMusic?.songId);
    
      let finalArtistID: number;
    
      // 1. Determine the Artist ID
      if (editMusicForm.artistName === "other") {
        try {
          const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MusicArtist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              artistName: newArtistName,
            }),
          });
    
          if (!resp.ok) {
            console.error("Failed to create new artist:", await resp.text());
            return;
          }
    
          const created = await resp.json();
          finalArtistID = created.musicArtistId;
    
          // Refresh the artists list
          const updatedArtists = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MusicArtist`).then((res) => res.json());
          setArtists(updatedArtists);
    
          // Update the state with the new artist's ID
          setEditMusicForm((f) => ({
            ...f,
            artist: finalArtistID.toString(),
            artistName: newArtistName,
          }));
        } catch (err) {
          console.error("Error creating new artist:", err);
          return;
        }
      } else {
        finalArtistID = Number(editMusicForm.artistName);
      }
    
      // 2. Prepare the Payload
      const payload = {
        title: editMusicForm.title,
        musicArtistId: finalArtistID,
        musicGenreId: Number(editMusicForm.musicGenreId!),
        format: editMusicForm.format,
        coverImagePath: editMusicForm.coverImagePath,
        totalCopies: Number(editMusicForm.totalCopies!),
        availableCopies: Number(editMusicForm.availableCopies!),
        location: editMusicForm.location,
        itemTypeID: 3, // Music
      };
    
      console.log("Final payload:", payload);
    
      // 3. Send the Update Request
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/Music/edit-music/${editingMusic.songId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
    
        if (res.ok) {
          // 4. Handle Success
          setOpenEditMusicDialog(false);
          setNewArtistName("");
          setRefreshData(true); // Trigger a refresh of the music list
        } else {
          const err = await res.text();
          console.error("Failed to save edits:", err);
        }
      } catch (err) {
        console.error("Error saving music edits:", err);
      }
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
        count: inventory.filter(item => item.availableCopies > 0).length, // Only count items with availableCopies > 0
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

      <Box sx={{ mb: 4 }}>
  {selectedItemType === "Book" && (
    <CurrentBooks
      books={bookInventory}
      onEdit={openEditBook}
      onDelete={b => {
        
        /* delete‐book handler */
      }}
    />
  )}
  {selectedItemType === "Movie" && (
    <CurrentMovies
      movies={movieInventory}
      onEdit={openEditMovie}
      onDelete={m => {
        /* delete‐movie handler */
      }}
    />
  )}
  {selectedItemType === "Music" && (
    <CurrentMusic
      music={musicInventory}
      onEdit={openEditMusic}
      onDelete={m => {
        /* delete‐music handler */
      }}
    />
  )}
  {selectedItemType === "Technology" && (
    <CurrentTechnology
      technology={technologyInventory}
      onEdit={openEditTech}
      onDelete={t => {
        /* delete‐technology handler */
      }}
    />
  )}
</Box>
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

        <EditBookDialog
        open={openEditBookDialog}
        editBookForm={editBookForm}
        authors={authors}
        genres={genres}
        publishers={publishers}
        newAuthorFirstName={newAuthorFirstName}
        newAuthorLastName={newAuthorLastName}
        newPublisherName={newPublisherName}
        setEditBookForm={setEditBookForm}
        setNewAuthorFirstName={setNewAuthorFirstName}
        setNewAuthorLastName={setNewAuthorLastName}
        setNewPublisherName={setNewPublisherName}
        handleSaveEditBook={handleSaveEditBook}
        onClose={() => setOpenEditBookDialog(false)}
      />

        <EditMovieDialog
          open={openEditMovieDialog}
          editMovieForm={editMovieForm}
          directors={directors}
          movieGenres={movieGenres}
          newDirectorFirstName={newDirectorFirstName}
          newDirectorLastName={newDirectorLastName}
          setEditMovieForm={setEditMovieForm}
          setNewDirectorFirstName={setNewDirectorFirstName}
          setNewDirectorLastName={setNewDirectorLastName}
          handleSaveEditMovie={handleSaveEditMovie}
          onClose={() => setOpenEditMovieDialog(false)}
        />
        
        <EditMusicDialog
          open={openEditMusicDialog}
          editMusicForm={editMusicForm}
          artists={artists}
          musicGenres={musicGenres}
          newArtistName = {newArtistName}
          setEditMusicForm={setEditMusicForm}
          setNewArtistName={setNewArtistName}
          handleSaveEditMusic={handleSaveEditMusic}
          onClose={() => setOpenEditMusicDialog(false)}
        />

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