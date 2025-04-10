import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import React from "react";

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

  const handlePaymentStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPaymentStatusFilter(event.target.value as string);
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
      setIsLaunched(true);
    } catch (error) {
      console.error("Error fetching report:", error);
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
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={reportData}
            columns={columns}
            loading={loading}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            sx={{ border: 0 }}
          />
        </Paper>
      )}
    </Stack>
  );
}
