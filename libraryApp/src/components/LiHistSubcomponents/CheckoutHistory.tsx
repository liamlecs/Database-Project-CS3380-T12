import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Transaction ID', width: 70 },
  { field: 'CustomerID', headerName: 'Customer ID', width: 130 },
  { field: 'ItemID', headerName: 'Item ID', width: 130 },
  {
    field: 'DateBorrowed',
    headerName: 'Date Borrowed',
    type: 'date',
    width: 90,
  },
  {
    field: 'DueDate',
    headerName: 'Due Date',
//type: 'date',
    width: 90,
  },
  {
    field: 'DateReturned',
    headerName: 'Date Returned',
    type: 'date',
    width: 90,
  },
];

const rows = [
  { id: 1, CustomerID: 'Snow', ItemID: 'Jon', DueDate: 35 },
  { id: 2, CustomerID: 'Lannister', ItemID: 'Cersei', DueDate: 42 },
  { id: 3, CustomerID: 'Lannister', ItemID: 'Jaime', DueDate: 45 },
  { id: 4, CustomerID: 'Stark', ItemID: 'Arya', DueDate: 16 },
  { id: 5, CustomerID: 'Targaryen', ItemID: 'Daenerys', DueDate: null },
  { id: 6, CustomerID: 'Melisandre', ItemID: null, DueDate: 150 },
  { id: 7, CustomerID: 'Clifford', ItemID: 'Ferrara', DueDate: 44 },
  { id: 8, CustomerID: 'Frances', ItemID: 'Rossini', DueDate: 36 },
  { id: 9, CustomerID: 'Roxie', ItemID: 'Harvey', DueDate: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function CheckoutHistory() {
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