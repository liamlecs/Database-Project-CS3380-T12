import {
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import React from "react";

const columns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "itemType", headerName: "Item Type", width: 150 },
  { field: "count", headerName: "Checkouts", width: 100, type: "number" },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function PopularityReport() {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [reportData, setReportData] = React.useState<
    { id: number; title: string; itemType: string; count: number }[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [isLaunched, setIsLaunched] = React.useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    setIsLaunched(false);

    try {
      let endpoint = "/api/TransactionHistory/popularity";

      if (startDate && endDate) {
        const formattedStart = dayjs(startDate).format("YYYY-MM-DD");
        const formattedEnd = dayjs(endDate).format("YYYY-MM-DD");
        endpoint = `/api/TransactionHistory/popularityConditional/${formattedStart}/${formattedEnd}`;
      }
      

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        alert("No data found in the selected date range.");
        return;
      }

      const report = await response.json();

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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Item Popularity Report</Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
  <Stack
    direction="row"
    spacing={2}
    justifyContent="center"
    sx={{ width: "100%" }}
  >
    <Stack sx={{ flex: 1 }}>
      <DatePicker
        label="Start Date (Optional)"
        value={startDate}
        onChange={setStartDate}
        disableFuture
        slotProps={{ textField: { fullWidth: true } }}
      />
    </Stack>
    <Stack sx={{ flex: 1 }}>
      <DatePicker
        label="End Date (Optional)"
        value={endDate}
        onChange={setEndDate}
        disableFuture
        slotProps={{ textField: { fullWidth: true } }}
      />
    </Stack>
  </Stack>
</LocalizationProvider>


      <Button
        variant="contained"
        onClick={handleGenerateReport}
        disabled={loading || (!!startDate !== !!endDate)} // only allow if both are filled or both empty
      >
        {loading ? "Loading..." : "Generate Report"}
      </Button>

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
    </Stack>
  );
}
