import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Donation ID', type: 'number', width: 70 },
  { field: 'customerId', headerName: 'Customer ID', type: 'number', width: 130 },
  {field: 'amount', headerName: 'Amount', type: 'number', width: 90 },
  { field: 'firstName', headerName: 'First Name', width: 120 },
  { field: 'lastName', headerName: 'Last Name', width: 120 },
  { field: 'date', headerName: 'Date', type:'date', width: 130 },
];

const paginationModel = { page: 0, pageSize: 5 };



export default function DonationHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Donation`);
        if (!response.ok) {
          throw new Error("Failed to fetch donation data");
        }
        const data = await response.json();
console.log("raw data: ", data);
        // Transform API response to fit DataGrid's row format
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                const formattedData = data.map((donation: any, index: number) => {
                  //console.log("amount: ", donation.amount);
                  return{
                  ...donation,
          id: donation.donationId || index + 1, // Ensure unique ID
          customerId: donation.customerId || "N/A",
          firstName: donation.firstName ?? 'N/A',
          lastName: donation.lastName ?? 'N/A',
          amount: donation.amount || 0,
          date: donation.date ? new Date(donation.date): null,
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