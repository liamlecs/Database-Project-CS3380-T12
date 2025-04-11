import {
  type SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
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
  { field: "daysOverdue", headerName: "Days Overdue", width: 100, type: 'number' },
  { field: "amount", headerName: "Amount Due", width: 100, type: 'number', },
  { field: "paymentStatus", headerName: "Payment Status", width: 100, type: 'boolean' },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function ItemFineReport() {
  const [type, setType] = React.useState("");
  const [isPaidBit, setIsPaidBit] = React.useState("");
  const [reportData, setReportData] = React.useState<
    { id: number; title: string; itemType: string; count: number }[] //CHANGE THIS (why does this work without changing anything?)
  >([]);
  const [isLaunched, setIsLaunched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleBoolChange = (event: SelectChangeEvent) => {
    setIsPaidBit(event.target.value as string);
  };

  const handleGenericCall = async () => {
    setLoading(true);
    setIsLaunched(false);

    try {

      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/withFine` //CHANGE THIS
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const report = await response.json();
      console.log("API Response:", report);

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const formattedData = report.map((item: any, index: number) => ({ //CHANGE THIS
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
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConditionalCall = async () => {

    setLoading(true);
    setIsLaunched(false);

    // biome-ignore lint/complexity/noUselessTernary: <for some reason true returns a false-like output and false returns a true-like output>
    const selectedPaymentStatus = isPaidBit === "0" ? false : true;
    try {

      console.log("Selected payment status:", selectedPaymentStatus);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/withFineConditional?isPaid=${encodeURIComponent(selectedPaymentStatus)}`, //CHANGE THIS
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        alert("No books have been checked out after this date.") //CHANGE THIS
        //throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const report = await response.json();
      console.log("API Response:", report);

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const formattedData = report.map((item: any, index: number) => ({ //CHANGE THIS
        id: index + 1,
        title: item.title,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        type: item.type,
        dateBorrowed: item.dateBorrowed,
        dueDate: item.dueDate,
        daysOverdue: dayjs().diff(item.dueDate, "day"),
        amount: item.amount,
      }));

      setReportData(formattedData);
      setIsLaunched(true);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Select a Report Type</h1>
      <FormControl fullWidth>
      <InputLabel id="select1">Type</InputLabel>
        <Select
          labelId="select1"
          id="select1"
          value={type}
          label="Payment Status"
          onChange={handleChange}
        >
          <MenuItem value="0">Without Conditions</MenuItem>
          <MenuItem value="1">With Conditions</MenuItem>
        </Select>
      </FormControl>

      {type === "0" && (
        <Button
          variant="contained"
          onClick={handleGenericCall}
          style={{ marginTop: "20px" }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate Report"}
        </Button>
      )}

      {type === "1" && (
        <div className="centeredHor">
        <Stack spacing={2} direction="row" alignItems="center" sx={{ marginTop: "20px" }}>
        <FormControl fullWidth>
        <InputLabel id="select2">Payment Status</InputLabel>
        <Select
          labelId="select2"
          id="select2"
          value={isPaidBit}
          label="Payment Status"
          onChange={handleBoolChange}
        >
        <MenuItem value="1">True</MenuItem>
          <MenuItem value="0">False</MenuItem>
        </Select>
        </FormControl>
          <Button
            variant="contained"
            onClick={handleConditionalCall}
            disabled={loading || !isPaidBit}
          >
            {loading ? "Loading..." : "Generate Report"}
          </Button>
        </Stack>
        </div>
      )}

      {isLaunched && (
        <Paper sx={{ height: 400, width: "100%", marginTop: "20px" }}>
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
    </div>
  );
}
