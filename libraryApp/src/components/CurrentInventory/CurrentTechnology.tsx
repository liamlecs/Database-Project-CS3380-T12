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
import type { TechnologyDto } from '../../types';

interface CurrentTechnologyProps {
    technology: TechnologyDto[];
    onEdit:     (technology: TechnologyDto) => void;
    onDelete?:  (technology: TechnologyDto) => void;
}

const CurrentTechnology: React.FC<CurrentTechnologyProps> = ({ technology, onEdit, onDelete }) => (
    <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
              {/* --- Current Technology --- */}
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>Current Technology</Typography>
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
                    {technology.map(t => (
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
                            <IconButton size="small" onClick={() => onEdit(t)}>
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

export default CurrentTechnology;