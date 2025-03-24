import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Transaction ID', width: 70 },
  { field: 'customerId', headerName: 'Customer ID', width: 130 },
  { field: 'itemId', headerName: 'Item ID', width: 130 },
  {
    field: 'dateBorrowed',
    headerName: 'Date Borrowed',
    type: 'date',
    width: 90,
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
type: 'date',
    width: 90,
  },
  {
    field: 'dateReturned',
    headerName: 'Date Returned',
    type: 'date',
    width: 90,
  },
];



const paginationModel = { page: 0, pageSize: 5 };

export default function CheckoutHistory() {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5217/api/TransactionHistory");
        if (!response.ok) {
          throw new Error("Failed to fetch donation data");
        }
        const data = await response.json();
        console.log("raw data: ", data);
        // Transform API response to fit DataGrid's row format
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const formattedData = data.map((transaction: any, index: number) => {
          //console.log("amount: ", donation.amount);
          return {
            ...transaction,
            id: transaction.transactionId || index + 1, // Ensure unique ID
            dateBorrowed: transaction.dateBorrowed
              ? new Date(transaction.dateBorrowed)
              : null,
            dueDate: transaction.dueDate
              ? new Date(transaction.dueDate)
              : null,
            customerId: transaction.customerId || -1,
            itermId: transaction.itemId || -1,
          };
        });
        console.log("formatted data: ", formattedData);
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[50, 100]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}