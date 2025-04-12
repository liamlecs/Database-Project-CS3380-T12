import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Waitlist ID', width: 70 },
  { field: 'customerId', headerName: 'Customer ID', type: 'number', width: 130 },
  { field: 'itemId', headerName: 'Item ID', type: 'number', width: 130 },
  {
    field: 'reservationDate',
    headerName: 'Reservation Date',
    type: 'date',
    width: 90,
  },
  {
    field: 'isReceived',
    headerName: 'Was Received?',
    type: 'boolean',
    width: 90,
  },
];



const paginationModel = { page: 0, pageSize: 5 };

export default function WaitlistHistory() {

 const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Waitlist`);
        if (!response.ok) {
          throw new Error("Failed to fetch waitlist history data");
        }
        const data = await response.json();
console.log("raw data: ", data);
        // Transform API response to fit DataGrid's row format
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                const formattedData = data.map((waitlist: any, index: number) => {
                  //console.log("amount: ", donation.amount);
                  return{
                  ...waitlist,
          id: waitlist.waitlistId || index + 1, // Ensure unique ID
          customerId: waitlist.customerId || "N/A",
          itemId: waitlist.itemId || 0,
          reservationDate: waitlist.reservationDate ? new Date(waitlist.reservationDate): null,
          isReceived: waitlist.isReceived || false,
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