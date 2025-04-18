import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Waitlist ID', width: 120 },
  // { field: 'customerId', headerName: 'Customer ID', type: 'number', width: 130 },
  // { field: 'itemId', headerName: 'Item ID', type: 'number', width: 130 },
  { field: 'firstName', headerName: 'First Name', width: 130 },
  { field: 'lastName', headerName: 'Last Name', width: 130 },
  { field: 'itemType', headerName: 'Item Type', width: 130 },
  { field: 'title', headerName: 'Item Title', width: 150},
  {
    field: 'reservationDate',
    headerName: 'Reservation Date',
    type: 'date',
    width: 150,
  },
  {
    field: 'isReceived',
    headerName: 'Was Received?',
    type: 'boolean',
    width: 150,
  },
];

export default function WaitlistHistory() {

 const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/detailed`);
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
          id: waitlist.waitlistId,
          // customerId: waitlist.customerId,
          // itemId: waitlist.itemId,
          firstName: waitlist.firstName,
          lastName: waitlist.lastName,
          itemType: waitlist.itemType,
          title: waitlist.title,
          reservationDate: waitlist.reservationDate ? new Date(waitlist.reservationDate): null,
          isReceived: waitlist.isReceived,
        }});
        console.log("formatted data: ",formattedData);
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, []);

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        hideFooterPagination
        disableRowSelectionOnClick
        sx={{ border: 0 }}
      />
    </Paper>
  );
}