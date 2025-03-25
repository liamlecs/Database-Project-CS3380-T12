import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Fine ID', width: 70 },
  { field: 'transactionId', headerName: 'Transaction ID', type: 'number', width: 130 },
  { field: 'customerId', headerName: 'Customer ID', type: 'number', width: 130 },
  {
    field: 'amount',
    headerName: 'Amount',
    type: 'number',
    width: 90,
  },
  { field: 'issueDate', headerName: 'Issue Date', type:'date', width: 130 },
  { field: 'dueDate', headerName: 'Due Date', type:'date', width: 130 },
  { field: 'paymentStatus', headerName: 'Payment Status', type:'boolean', width: 130 },
];

const paginationModel = { page: 0, pageSize: 50 };

export default function FineHistory() {

 const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Fine`);
        if (!response.ok) {
          throw new Error("Failed to fetch donation data");
        }
        const data = await response.json();
console.log("raw data: ", data);
        // Transform API response to fit DataGrid's row format
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                const formattedData = data.map((fine: any, index: number) => {
                  //console.log("amount: ", donation.amount);
                  return{
                  ...fine,
          id: fine.fineId || index + 1, // Ensure unique ID
          transactionId: fine.transactionId || 0,
          customerId: fine.customerId || 0,
          amount: fine.amount || 0,
          dueDate: fine.dueDate ? new Date(fine.dueDate): null,
          issueDate: fine.issueDate ? new Date(fine.issueDate): null,
          paymentStatus: fine.paymentStatus || false,
        }});
        console.log("formatted data: ",formattedData);
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
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