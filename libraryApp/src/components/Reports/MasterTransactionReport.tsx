import {
  Stack,
  Typography,
  Paper,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import type { Dayjs } from "dayjs";

type TransactionFineDto = {
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
};

type TransactionPopularityDto = {
  title: string;
  count: number;
  itemType: string;
};

type MasterTransactionReportDto = {
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
};



export default function MasterTransactionReport() {
  const [selectedStartDate, setSelectedStartDate] = React.useState<Dayjs | null>(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<Dayjs | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [reportOutput, setReportOutput] = React.useState<MasterTransactionReportDto[]>([]);

  const handleCall = async () => {
    setLoading(true);
    try {
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let response;
      if (selectedStartDate && selectedEndDate) {
        const formattedStart = selectedStartDate.format("YYYY-MM-DD");
        const formattedEnd = selectedEndDate.format("YYYY-MM-DD");
        console.log(formattedStart, " - ", formattedEnd)
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
      console.log(report);
      setReportOutput([report]);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const report = reportOutput[0];

  return (
    <Stack spacing={4} alignItems="center" sx={{ mt: 4 }}>
      {/* Date pickers and trigger button */}
      <Stack direction="row" spacing={2} alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start Date" value={selectedStartDate} onChange={setSelectedStartDate} disableFuture/>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="End Date" value={selectedEndDate} onChange={setSelectedEndDate} disableFuture/>
        </LocalizationProvider>
        <Button
          variant="contained"
          onClick={handleCall}
          disabled={loading || (!!selectedStartDate !== !!selectedEndDate)}
        >
          {loading ? "Loading..." : "Generate Report"}
        </Button>
      </Stack>

      {/* Report output */}
      {!loading && report && (
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: "1000px" }}>
          <Typography variant="h5" gutterBottom>
            Master Transaction Report
          </Typography>

          <Divider sx={{ my: 2 }} />

          {report.registeredUsersThatJoined > -1 && selectedStartDate != null &&
  selectedEndDate != null && (
  <Typography variant="subtitle1">
   Users Registered from{" "}
    <strong>{selectedStartDate.format("MMM DD, YYYY")}</strong> to{" "}
    <strong>{selectedEndDate.format("MMM DD, YYYY")}</strong>:{" "}
    {report.registeredUsersThatJoined}
  </Typography>
)}
          <Typography variant="subtitle1">Registered Users: {report.registeredUsers}</Typography>
          <Typography variant="subtitle1">Outstanding Fines: ${report.outstandingFines}</Typography>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Inventory Statistics
          </Typography>
          <GridTable
            headers={["Type", "Titles", "Total Copies", "Available Copies"]}
            rows={[
              ["Books", report.bookTitleCount, report.totalBookCount, report.availableBookCount],
              ["Movies", report.movieTitleCount, report.totalMovieCount, report.availableMovieCount],
              ["Music", report.musicTitleCount, report.totalMusicCount, report.availableMusicCount],
              ["Tech", report.techTitleCount, report.totalTechCount, report.availableTechCount],
            ]}
          />

<Grid container spacing={2} sx={{ mt: 2 }}>
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
          Checkout Instances
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


          {/* Transaction Popularity */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Most Popular Items
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Item Type</TableCell>
                  <TableCell>Checkouts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.transactionPopularity.map((item, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.itemType}</TableCell>
                    <TableCell>{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Fines */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Transactions With Fines
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Item Type</TableCell>
                  <TableCell>Fine Issued</TableCell>
                  {/*<TableCell>Date Borrowed</TableCell>*/}
                  {/*<TableCell>Due Date</TableCell>*/}
                  <TableCell>Fine Amount</TableCell>
                  <TableCell>Paid?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.transactionFine.map((fine, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{`${fine.firstName} ${fine.lastName}`}</TableCell>
                    <TableCell>{fine.title}</TableCell>
                    <TableCell>{fine.itemType}</TableCell>
                    {/*<TableCell>{fine.dateBorrowed}</TableCell>*/}
                    {/*<TableCell>{fine.dueDate}</TableCell>*/}
                    <TableCell>{fine.issueDate}</TableCell>
                    <TableCell>${fine.amount.toFixed(2)}</TableCell>
                    <TableCell>{fine.paymentStatus === 1 ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Stack>
  );
}

// Helper component for simple tabular data
const GridTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) => (
  <TableContainer component={Paper} sx={{ mb: 2 }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          {headers.map((header, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableCell key={i}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableRow key={i}>
            {row.map((cell, j) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableCell key={j}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);