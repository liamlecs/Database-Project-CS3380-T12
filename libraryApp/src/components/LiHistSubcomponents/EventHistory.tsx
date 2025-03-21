import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Event ID', width: 70 },
  { field: 'StartTimeStamp', headerName: 'Start Time Stamp', width: 130 },
  { field: 'EndTimeStamp', headerName: 'End Time Stamp', width: 130 },
  {
    field: 'AgeGroup',
    headerName: 'Age Group',
    type: 'number',
    width: 90,
  },
  { field: 'Location', headerName: 'Location', width: 130 },
  { field: 'CategoryID', headerName: 'CategoryID', type:'number', width: 130 },
  { field: 'IsPrivate', headerName: 'IsPrivate', type: 'boolean', width: 130 },

];

const rows = [
  { id: 1, EndTimeStamp: 'Snow', StartTimeStamp: 'Jon', AgeGroup: 35 },
  { id: 2, EndTimeStamp: 'Lannister', StartTimeStamp: 'Cersei', AgeGroup: 42 },
  { id: 3, EndTimeStamp: 'Lannister', StartTimeStamp: 'Jaime', AgeGroup: 45 },
  { id: 4, EndTimeStamp: 'Stark', StartTimeStamp: 'Arya', AgeGroup: 16 },
  { id: 5, EndTimeStamp: 'Targaryen', StartTimeStamp: 'Daenerys', AgeGroup: null },
  { id: 6, EndTimeStamp: 'Melisandre', StartTimeStamp: null, AgeGroup: 150 },
  { id: 7, EndTimeStamp: 'Clifford', StartTimeStamp: 'Ferrara', AgeGroup: 44 },
  { id: 8, EndTimeStamp: 'Frances', StartTimeStamp: 'Rossini', AgeGroup: 36 },
  { id: 9, EndTimeStamp: 'Roxie', StartTimeStamp: 'Harvey', AgeGroup: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function EventHistory() {
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[50, 100]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}