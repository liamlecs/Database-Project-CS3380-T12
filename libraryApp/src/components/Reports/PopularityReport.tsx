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
  { field: "title", headerName: "Title", width: 200 },
  { field: "itemType", headerName: "Item Type", width: 150 },
  { field: "count", headerName: "Count", width: 100, type: "number" },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function PopularityReport() {
  const [type, setType] = React.useState("");
  const [reportData, setReportData] = React.useState<
    { id: number; title: string; itemType: string; count: number }[]
  >([]);
  const [isLaunched, setIsLaunched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleGenericCall = async () => {
    setLoading(true);
    setIsLaunched(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/popularity`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const report = await response.json();
      console.log("API Response:", report);

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const formattedData = report.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title,
        itemType: item.itemType,
        count: item.count,
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
    if (!selectedDate) {
      console.error("No date selected.");
      return;
    }

    setLoading(true);
    setIsLaunched(false);

    try {
      const formattedDate = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : "";

      console.log(formattedDate);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/popularityConditional?dateFilter=${encodeURIComponent(formattedDate)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        alert("No books have been checked out after this date.")
        //throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const report = await response.json();
      console.log("API Response:", report);

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const formattedData = report.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title,
        itemType: item.itemType,
        count: item.count,
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
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          label="Type"
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            onClick={handleConditionalCall}
            disabled={loading || !selectedDate}
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
