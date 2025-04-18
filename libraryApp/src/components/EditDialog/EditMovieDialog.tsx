import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

import { MovieDto } from "../../types"; // Adjust the path as needed

interface EditMovieDialogProps {
  open: boolean;
  editMovieForm: Partial<MovieDto>;
  directors: { movieDirectorId: number; firstName: string; lastName: string }[];
  movieGenres: { movieGenreId: number; description: string }[];
  newDirectorFirstName: string;
  newDirectorLastName: string;
  setEditMovieForm: React.Dispatch<React.SetStateAction<Partial<MovieDto>>>;
  setNewDirectorFirstName: React.Dispatch<React.SetStateAction<string>>;
  setNewDirectorLastName: React.Dispatch<React.SetStateAction<string>>;
  handleSaveEditMovie: () => void;
  onClose: () => void;
}

const EditMovieDialog: React.FC<EditMovieDialogProps> = ({
  open,
  editMovieForm,
  directors,
  movieGenres,
  newDirectorFirstName,
  newDirectorLastName,
  setEditMovieForm,
  setNewDirectorFirstName,
  setNewDirectorLastName,
  handleSaveEditMovie,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Movie</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            value={editMovieForm.title || ""}
            onChange={(e) =>
              setEditMovieForm((f) => ({ ...f, title: e.target.value }))
            }
          />
          <TextField
            label="UPC"
            fullWidth
            value={editMovieForm.upc || ""}
            onChange={(e) =>
              setEditMovieForm((f) => ({ ...f, upc: e.target.value }))
            }
          />

          {/* Director Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Director</InputLabel>
            <Select
              value={editMovieForm.director || "other"}
              label="Director"
              onChange={(e) => {
                const v = e.target.value as string;
                if (v === "other") {
                  setEditMovieForm((f) => ({
                    ...f,
                    director: "other",
                    directorFirstName: "",
                    directorLastName: "",
                  }));
                } else {
                  const selectedDirector = directors.find(
                    (d) => d.movieDirectorId === Number(v)
                  );
                  if (selectedDirector) {
                    setEditMovieForm((f) => ({
                      ...f,
                      director: selectedDirector.movieDirectorId.toString(),
                      directorFirstName: selectedDirector.firstName,
                      directorLastName: selectedDirector.lastName,
                    }));
                  }
                }
              }}
            >
              {directors.map((d) => (
                <MenuItem key={d.movieDirectorId} value={d.movieDirectorId}>
                  {d.firstName} {d.lastName}
                </MenuItem>
              ))}
              <MenuItem value="other">Other…</MenuItem>
            </Select>
          </FormControl>
          {!editMovieForm.directorFirstName && !editMovieForm.directorLastName && (
            <Stack direction="row" spacing={2}>
              <TextField
                label="New Director First Name"
                value={newDirectorFirstName}
                onChange={(e) => setNewDirectorFirstName(e.target.value)}
                fullWidth
              />
              <TextField
                label="New Director Last Name"
                value={newDirectorLastName}
                onChange={(e) => setNewDirectorLastName(e.target.value)}
                fullWidth
              />
            </Stack>
          )}

          {/* Genre Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              value={editMovieForm.genre || ""}
              label="Genre"
              onChange={(e) => {
                const selectedGenreId = e.target.value as string;
                setEditMovieForm((f) => ({
                  ...f,
                  genre: selectedGenreId,
                }));
              }}
            >
              {movieGenres.map((g) => (
                <MenuItem key={g.movieGenreId} value={g.movieGenreId}>
                  {g.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Format"
            fullWidth
            value={editMovieForm.format || ""}
            onChange={(e) =>
              setEditMovieForm((f) => ({ ...f, format: e.target.value }))
            }
          />
          <TextField
            label="Year Released"
            type="number"
            fullWidth
            value={editMovieForm.yearReleased ?? ""}
            onChange={(e) =>
              setEditMovieForm((f) => ({
                ...f,
                yearReleased: Number(e.target.value),
              }))
            }
          />
          <TextField
            label="Total Copies"
            type="number"
            fullWidth
            value={editMovieForm.totalCopies ?? ""}
            onChange={(e) =>
              setEditMovieForm((f) => ({
                ...f,
                totalCopies: Number(e.target.value),
              }))
            }
          />
          <TextField
            label="Available Copies"
            type="number"
            fullWidth
            value={editMovieForm.availableCopies ?? ""}
            onChange={(e) =>
              setEditMovieForm((f) => ({
                ...f,
                availableCopies: Number(e.target.value),
              }))
            }
          />
          <TextField
            label="Location"
            fullWidth
            value={editMovieForm.itemLocation || ""}
            onChange={(e) =>
              setEditMovieForm((f) => ({
                ...f,
                itemLocation: e.target.value,
              }))
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveEditMovie}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMovieDialog;