import React from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack
} from '@mui/material';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { MovieDto } from '../../types';

interface CurrentMoviesProps {
    movies:    MovieDto[];
    onEdit:   (movie: MovieDto) => void;
    onDelete?: (movie: MovieDto) => void;
}

const CurrentMovies: React.FC<CurrentMoviesProps> = ({ movies, onEdit, onDelete }) => (
    <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
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
                    {movies.map(m => (
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
                            <IconButton size="small" onClick={() => onEdit(m)}>
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

export default CurrentMovies;