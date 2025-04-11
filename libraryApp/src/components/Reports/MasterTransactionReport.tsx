import {
  Stack,
  Typography,
  Paper,
  Divider,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import type { Dayjs } from "dayjs";

// Existing DTOs
interface TransactionFineDto {
  title: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  dateBorrowed: string;
  dueDate: string;
  issueDate: string;
  amount: number;
  paymentStatus: number;
  itemType: string;
}

interface TransactionPopularityDto {
  title: string;
  count: number;
  itemType: string;
}

interface MasterTransactionReportDto {
  timestamp: string;
  registeredUsersThatJoined: number;
  bookTitleCount: number;
  totalBookCount: number;
  availableBookCount: number;
  movieTitleCount: number;
  totalMovieCount: number;
  availableMovieCount: number;
  musicTitleCount: number;
  totalMusicCount: number;
  availableMusicCount: number;
  techTitleCount: number;
  totalTechCount: number;
  availableTechCount: number;
  outstandingFines: number;
  registeredUsers: number;
  checkoutInstances: number;
  uniqueCustomers: number;
  totalTitleCount: number;
  totalCopiesCount: number;
  totalAvailableCount: number;
  transactionFine: TransactionFineDto[];
  transactionPopularity: TransactionPopularityDto[];
}

interface CustomerReportDto {
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  membershipStartDate: string;
  membershipEndDate?: string;
  borrowingLimit: number;
  emailConfirmed: boolean;
}

interface InventoryItem {
  itemId: number;
  title: string;
  availabilityStatus: string;
  totalCopies: number;
  availableCopies: number;
  location?: string;
}

const customerReportColumns: GridColDef[] = [
  { field: "email", headerName: "Email", width: 200 },
  { field: "firstName", headerName: "First Name", width: 150 },
  { field: "lastName", headerName: "Last Name", width: 150 },
  { field: "type", headerName: "Type", width: 120 },
  { field: "membershipStartDate", headerName: "Start Date", width: 150 },
  { field: "membershipEndDate", headerName: "End Date", width: 150 },
  { field: "borrowingLimit", headerName: "Limit", width: 100, type: "number" },
  { field: "emailConfirmed", headerName: "Email Confirmed", width: 150, type: "boolean" },
];

export default function MasterTransactionReport() {
  const [selectedStartDate, setSelectedStartDate] = React.useState<Dayjs | null>(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<Dayjs | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [reportOutput, setReportOutput] = React.useState<MasterTransactionReportDto[]>([]);
  const [inventoryData, setInventoryData] = React.useState<InventoryItem[]>([]);
  const [customerData, setCustomerData] = React.useState<CustomerReportDto[]>([]);

  const handleCall = async () => {
    setLoading(true);
    try {
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let response;
      if (selectedStartDate && selectedEndDate) {
        const formattedStart = selectedStartDate.format("YYYY-MM-DD");
        const formattedEnd = selectedEndDate.format("YYYY-MM-DD");
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/masterTransactionReportConditional/${formattedStart}/${formattedEnd}`
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/masterTransactionReport`
        );
      }

      if (!response.ok) throw new Error("Fetch failed");
      const report = await response.json();
      setReportOutput([report]);

      const inventoryRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Item`);
      if (!inventoryRes.ok) throw new Error("Failed to fetch inventory");
      const inventory = await inventoryRes.json();
      setInventoryData(inventory);

      const customerDetails = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Customer/CustomerDetails`);
      if (!customerDetails.ok) throw new Error("Failed to fetch customers");
      const parsedCustomerDetails = await customerDetails.json();
      setCustomerData(parsedCustomerDetails);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const report = reportOutput[0];

  const popularityColumns: GridColDef[] = [
    { field: "id", headerName: "#", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "itemType", headerName: "Item Type", width: 150 },
    { field: "count", headerName: "Checkouts", type: "number", width: 130 },
  ];

  const fineColumns: GridColDef[] = [
    { field: "id", headerName: "#", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "itemType", headerName: "Item Type", width: 150 },
    { field: "issueDate", headerName: "Fine Issued", width: 150 },
    { field: "amount", headerName: "Fine Amount", width: 130, type: "number" },
  ];

  const inventoryColumns: GridColDef[] = [
    { field: "id", headerName: "#", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "availabilityStatus", headerName: "Status", width: 150 },
    { field: "totalCopies", headerName: "Total Copies", width: 150, type: "number" },
    { field: "availableCopies", headerName: "Available Copies", width: 150, type: "number" },
    { field: "location", headerName: "Location", width: 200 },
  ];

  return (
    <Stack spacing={4} alignItems="center" sx={{ mt: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start Date (Optional)" value={selectedStartDate} onChange={setSelectedStartDate} disableFuture />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="End Date (Optional)" value={selectedEndDate} onChange={setSelectedEndDate} disableFuture />
        </LocalizationProvider>
        <Button
          variant="contained"
          onClick={handleCall}
          disabled={loading || (!!selectedStartDate !== !!selectedEndDate)}
        >
          {loading ? "Loading..." : "Generate Report"}
        </Button>
      </Stack>

      {!loading && report && (
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: "1000px" }}>
          <Typography variant="h5" gutterBottom>
            Master Library Report
          </Typography>

          <Divider sx={{ my: 2 }} />

          {report.registeredUsersThatJoined > -1 && selectedStartDate && selectedEndDate && (
            <Typography variant="subtitle1">
              Users Registered from <strong>{selectedStartDate.format("MMM DD, YYYY")}</strong> to <strong>{selectedEndDate.format("MMM DD, YYYY")}</strong>: {report.registeredUsersThatJoined}
            </Typography>
          )}
          <Typography variant="subtitle1">Total Registered Users: {report.registeredUsers}</Typography>
          <Typography variant="subtitle1">Outstanding Fines: ${report.outstandingFines}</Typography>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Inventory Statistics
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Total Titles
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {report.totalTitleCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Total Copies Across All Items
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {report.totalCopiesCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Total Available Items
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {report.totalAvailableCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Checkout Activity
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Item Checkouts
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {report.checkoutInstances}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Unique Customers
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {report.uniqueCustomers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Most Popular Items
          </Typography>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={report.transactionPopularity.map((item, index) => ({ id: index + 1, ...item }))}
              columns={popularityColumns}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </div>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Outstanding Fines
          </Typography>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={report.transactionFine.map((fine, index) => ({
                id: index + 1,
                name: `${fine.firstName} ${fine.lastName}`,
                title: fine.title,
                itemType: fine.itemType,
                issueDate: fine.issueDate,
                amount: fine.amount,
              }))}
              columns={fineColumns}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </div>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Current Inventory Snapshot
          </Typography>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={inventoryData.map((item, index) => ({ id: index + 1, ...item }))}
              columns={inventoryColumns}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </div>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Customer Summary
          </Typography>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={customerData.map((customer, index) => ({ id: index + 1, ...customer }))}
              columns={customerReportColumns}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </div>
        </Paper>
      )}
    </Stack>
  );
}
