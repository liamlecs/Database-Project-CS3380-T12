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
import type { MusicDto } from '../../types';

interface CurrentMusicProps {
    music:    MusicDto[];
    onEdit:   (music: MusicDto) => void;
    onDelete?: (music: MusicDto) => void;
}

const CurrentMusic: React.FC<CurrentMusicProps> = ({ music, onEdit, onDelete }) => (
    <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
              {/* --- Current Music --- */}
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>Current Music</Typography>
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
                    {music.map(m => (
                      <TableRow key={m.songId}>
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
                            <IconButton size="small" onClick={() => onEdit(m)}>
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                if (onDelete) {
                                  onDelete(m); // Call the onDelete function with the current book
                                }
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

export default CurrentMusic;