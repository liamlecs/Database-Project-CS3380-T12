import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import React from "react";
import type { SelectChangeEvent } from "@mui/material";

interface FineSummaryDto {
  mostFinedCustomerEmail?: string;
  numberOfFines?: number;
  maxUnpaidFineAmount?: number;
  associatedItemTitle?: string;
  associatedItemType?: string;
  maxFineCustomerEmail?: string;
  //avgDaysLate?: number;
}

export interface CustomerReportDto {
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  membershipStartDate: string;
  membershipEndDate?: string;
  borrowingLimit: number;
  emailConfirmed: boolean;
}

const columns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 150 },
  { field: "email", headerName: "Email", width: 100 },
  { field: "firstName", headerName: "First Name", width: 100 },
  { field: "lastName", headerName: "Last Name", width: 100 },
  { field: "type", headerName: "Type", width: 100 },
  { field: "dateBorrowed", headerName: "Date Borrowed", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
  { field: "issueDate", headerName: "Issue Date", width: 150 },
  { field: "daysOverdue", headerName: "Days Overdue", width: 100, type: "number" },
  { field: "amount", headerName: "Amount Due", width: 100, type: "number" },
  { field: "paymentStatus", headerName: "Payment Status", width: 100, type: "boolean" },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ItemFineReport() {
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState("");
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isLaunched, setIsLaunched] = React.useState(false);
  const [fineSummary, setFineSummary] = React.useState<FineSummaryDto | null>(null);
  const [worstOffenderInfo, setWorstOffenderInfo] = React.useState<CustomerReportDto | null>(null);
  const [maxOffenderInfo, setMaxOffenderInfo] = React.useState<CustomerReportDto | null>(null);

  React.useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!fineSummary) return;

      if (fineSummary.mostFinedCustomerEmail) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Customer/by-email/${fineSummary.mostFinedCustomerEmail}`);
        if (res.ok) {
          const data = await res.json();
          setWorstOffenderInfo(data);
        }
      }

      if (fineSummary.maxFineCustomerEmail) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Customer/by-email/${fineSummary.maxFineCustomerEmail}`);
        if (res.ok) {
          const data = await res.json();
          setMaxOffenderInfo(data);
        }
      }
    };

    fetchCustomerDetails();
  }, [fineSummary]);

  const handlePaymentStatusChange = (event: SelectChangeEvent<string>) => {
    setPaymentStatusFilter(event.target.value);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setIsLaunched(false);

    const shouldApplyCondition = paymentStatusFilter !== "";
    // biome-ignore lint/complexity/noUselessTernary: <explanation>
    const isPaid = paymentStatusFilter === "1" ? true : false;

    try {
      const url = shouldApplyCondition
        ? `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/withFineConditional?isPaid=${encodeURIComponent(isPaid)}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/withFine`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const report = await response.json();
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const formattedData = report.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        type: item.type,
        dateBorrowed: item.dateBorrowed,
        dueDate: item.dueDate,
        issueDate: item.issueDate,
        daysOverdue: dayjs().diff(item.dueDate, "day"),
        amount: item.amount,
        paymentStatus: item.paymentStatus,
      }));

      setReportData(formattedData);

      const fineSummaryRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Fine/FineSummary`);
      if (fineSummaryRes.ok) {
        const summary = await fineSummaryRes.json();
        setFineSummary(summary);
      }

      setIsLaunched(true);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Fine Report</Typography>

      <FormControl fullWidth>
        <InputLabel id="paymentStatus-label">Payment Status (Optional)</InputLabel>
        <Select
          labelId="paymentStatus-label"
          value={paymentStatusFilter}
          label="Payment Status (Optional)"
          onChange={handlePaymentStatusChange}
        >
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="1">Paid</MenuItem>
          <MenuItem value="0">Unpaid</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleGenerateReport} disabled={loading}>
        {loading ? "Loading..." : "Generate Report"}
      </Button>

      {isLaunched && (
        <Paper sx={{ width: "100%", p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Fine Summary Overview
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Customer With Most Fines
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {fineSummary?.mostFinedCustomerEmail ?? "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Name:</strong> {worstOffenderInfo?.firstName ?? "N/A"} {worstOffenderInfo?.lastName ?? "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Fines:</strong> {fineSummary?.numberOfFines ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Most Expensive Unpaid Fine
                  </Typography>
                  <Typography variant="body1">
                    <strong>Amount:</strong> ${fineSummary?.maxUnpaidFineAmount?.toFixed(2) ?? "0.00"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Item:</strong> {fineSummary?.associatedItemTitle ?? "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Type:</strong> {fineSummary?.associatedItemType ?? "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {fineSummary?.maxFineCustomerEmail ?? "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Name:</strong> {maxOffenderInfo?.firstName ?? "N/A"} {maxOffenderInfo?.lastName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/*<Grid item xs={12} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Average Days Overdue For Fined Items
                  </Typography>
                  <Typography variant="h5">
                    {fineSummary?.avgDaysLate?.toFixed(1) ?? "0.0"} days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>*/}
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Detailed Fine Report
          </Typography>

          <DataGrid
            rows={reportData}
            columns={columns}
            loading={loading}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            sx={{ border: 0, mt: 2 }}
          />
        </Paper>
      )}
    </Stack>
  );
}
