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
  Typography,
  Box,
} from "@mui/material";
import { BookDto } from "../../types"; // Adjust the path as needed

interface EditBookDialogProps {
  open: boolean;
  editBookForm: Partial<BookDto>;
  authors: { bookAuthorId: number; firstName: string; lastName: string }[];
  genres: { bookGenreId: number; description: string }[];
  publishers: { publisherId: number; publisherName: string }[];
  newAuthorFirstName: string;
  newAuthorLastName: string;
  newPublisherName: string;
  setEditBookForm: React.Dispatch<React.SetStateAction<Partial<BookDto>>>;
  setNewAuthorFirstName: React.Dispatch<React.SetStateAction<string>>;
  setNewAuthorLastName: React.Dispatch<React.SetStateAction<string>>;
  setNewPublisherName: React.Dispatch<React.SetStateAction<string>>;
  handleSaveEditBook: () => void;
  onClose: () => void;
}

const EditBookDialog: React.FC<EditBookDialogProps> = ({
  open,
  editBookForm,
  authors,
  genres,
  publishers,
  newAuthorFirstName,
  newAuthorLastName,
  newPublisherName,
  setEditBookForm,
  setNewAuthorFirstName,
  setNewAuthorLastName,
  setNewPublisherName,
  handleSaveEditBook,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Book</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            value={editBookForm.title || ""}
            onChange={(e) =>
              setEditBookForm((f) => ({ ...f, title: e.target.value }))
            }
          />
          <TextField
            label="ISBN"
            fullWidth
            value={editBookForm.isbn || ""}
            onChange={(e) =>
              setEditBookForm((f) => ({ ...f, isbn: e.target.value }))
            }
          />
          {/* Author Select */}
          <FormControl fullWidth>
            <InputLabel>Author</InputLabel>
            <Select
              value={editBookForm.author || "other"}
              label="Author"
              onChange={(e) => {
                const v = e.target.value as string;
                if (v === "other") {
                  setEditBookForm((f) => ({
                    ...f,
                    author: "other",
                    authorFirstName: "",
                    authorLastName: "",
                  }));
                } else {
                  const selectedAuthor = authors.find(
                    (a) => a.bookAuthorId === Number(v)
                  );
                  if (selectedAuthor) {
                    setEditBookForm((f) => ({
                      ...f,
                      author: selectedAuthor.bookAuthorId.toString(),
                      authorFirstName: selectedAuthor.firstName,
                      authorLastName: selectedAuthor.lastName,
                    }));
                  }
                }
              }}
            >
              {authors.map((a) => (
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
                onChange={(e) => setNewAuthorFirstName(e.target.value)}
                fullWidth
              />
              <TextField
                label="New Author Last Name"
                value={newAuthorLastName}
                onChange={(e) => setNewAuthorLastName(e.target.value)}
                fullWidth
              />
            </Stack>
          )}
          {/* Genre Select */}
          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              value={editBookForm.genre || ""}
              label="Genre"
              onChange={(e) =>
                setEditBookForm((f) => ({
                  ...f,
                  genre: e.target.value as string,
                }))
              }
            >
              {genres.map((g) => (
                <MenuItem key={g.bookGenreId} value={g.bookGenreId}>
                  {g.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Publisher Select */}
          <FormControl fullWidth>
            <InputLabel>Publisher</InputLabel>
            <Select
              value={editBookForm.publisher || "other"}
              label="Publisher"
              onChange={(e) => {
                const v = e.target.value as string;
                if (v === "other") {
                  setEditBookForm((f) => ({ ...f, publisher: "other" }));
                } else {
                  setEditBookForm((f) => ({ ...f, publisher: v }));
                }
              }}
            >
              {publishers.map((p) => (
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
              onChange={(e) => setNewPublisherName(e.target.value)}
              fullWidth
            />
          )}
          <TextField
            label="Year Published"
            type="number"
            fullWidth
            value={editBookForm.yearPublished ?? ""}
            onChange={(e) =>
              setEditBookForm((f) => ({
                ...f,
                yearPublished: Number(e.target.value),
              }))
            }
          />
          <TextField
            label="Total Copies"
            type="number"
            fullWidth
            value={editBookForm.totalCopies ?? ""}
            onChange={(e) =>
              setEditBookForm((f) => ({
                ...f,
                totalCopies: Number(e.target.value),
              }))
            }
          />
          <TextField
            label="Available Copies"
            type="number"
            fullWidth
            value={editBookForm.availableCopies ?? ""}
            onChange={(e) =>
              setEditBookForm((f) => ({
                ...f,
                availableCopies: Number(e.target.value),
              }))
            }
          />
          <TextField
            label="Location"
            fullWidth
            value={editBookForm.itemLocation || ""}
            onChange={(e) =>
              setEditBookForm((f) => ({
                ...f,
                itemLocation: e.target.value,
              }))
            }
          />
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Cover Image
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {editBookForm.coverImagePath && (
                <img
                  src={editBookForm.coverImagePath}
                  alt="cover preview"
                  style={{ width: 50, height: 75, objectFit: "cover" }}
                />
              )}
              <Button variant="outlined" component="label" size="small">
                Choose Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const form = new FormData();
                    form.append("Cover", file);
                    try {
                      const resp = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL}/api/Book/upload-cover`,
                        { method: "POST", body: form }
                      );
                      const { url } = await resp.json();
                      setEditBookForm((f) => ({ ...f, coverImagePath: url }));
                    } catch (err) {
                      console.error("Upload failed", err);
                    }
                  }}
                />
              </Button>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSaveEditBook}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookDialog;