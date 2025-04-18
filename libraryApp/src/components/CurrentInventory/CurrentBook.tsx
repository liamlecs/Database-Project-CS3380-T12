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
import type { BookDto } from '../../types';

interface CurrentBooksProps {
  books:    BookDto[];
  onEdit:   (book: BookDto) => void;
  onDelete?: (book: BookDto) => void;
}

const CurrentBooks: React.FC<CurrentBooksProps> = ({ books, onEdit, onDelete }) => (
  <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
    <Typography variant="h6" align="center" sx={{ mt: 2 }}>Current Books</Typography>
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
                {books.map(b => (
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
                        <IconButton size="small" onClick={() => onEdit(b)}>
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

export default CurrentBooks;
