import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Donation ID', width: 70 },
  { field: 'TransactionID', headerName: 'Transaction ID', width: 130 },
  { field: 'CustomerID', headerName: 'Customer ID', width: 130 },
  {
    field: 'Amount', headerName: 'Amount', type: 'number', width: 90 },
  { field: 'Date', headerName: 'Date', type:'date', width: 130 },
];

const rows = [
  { id: 1, CustomerID: 'Snow', TransactionID: 'Jon', Amount: 35 },
  { id: 2, CustomerID: 'Lannister', TransactionID: 'Cersei', Amount: 42 },
  { id: 3, CustomerID: 'Lannister', TransactionID: 'Jaime', Amount: 45 },
  { id: 4, CustomerID: 'Stark', TransactionID: 'Arya', Amount: 16 },
  { id: 5, CustomerID: 'Targaryen', TransactionID: 'Daenerys', Amount: null },
  { id: 6, CustomerID: 'Melisandre', TransactionID: null, Amount: 150 },
  { id: 7, CustomerID: 'Clifford', TransactionID: 'Ferrara', Amount: 44 },
  { id: 8, CustomerID: 'Frances', TransactionID: 'Rossini', Amount: 36 },
  { id: 9, CustomerID: 'Roxie', TransactionID: 'Harvey', Amount: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DonationHistory() {
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