import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Waitlist ID', width: 70 },
  { field: 'CustomerID', headerName: 'Customer ID', width: 130 },
  { field: 'ItemID', headerName: 'Item ID', width: 130 },
  {
    field: 'ReservationDate',
    headerName: 'Reservation Date',
    //type: 'date',
    width: 90,
  },
  {
    field: 'Status',
    headerName: 'Status',
    type: 'boolean',
    width: 90,
  },
];

const rows = [
  { id: 1, ItemID: 'Snow', CustomerID: 'Jon', ReservationDate: 35 },
  { id: 2, ItemID: 'Lannister', CustomerID: 'Cersei', ReservationDate: 42 },
  { id: 3, ItemID: 'Lannister', CustomerID: 'Jaime', ReservationDate: 45 },
  { id: 4, ItemID: 'Stark', CustomerID: 'Arya', ReservationDate: 16 },
  { id: 5, ItemID: 'Targaryen', CustomerID: 'Daenerys', ReservationDate: null },
  { id: 6, ItemID: 'Melisandre', CustomerID: null, ReservationDate: 150 },
  { id: 7, ItemID: 'Clifford', CustomerID: 'Ferrara', ReservationDate: 44 },
  { id: 8, ItemID: 'Frances', CustomerID: 'Rossini', ReservationDate: 36 },
  { id: 9, ItemID: 'Roxie', CustomerID: 'Harvey', ReservationDate: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function WaitlistHistory() {
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