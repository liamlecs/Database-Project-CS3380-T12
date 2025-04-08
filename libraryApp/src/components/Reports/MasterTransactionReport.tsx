import { Stack, FormControl, InputLabel, Select, Button, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import React from "react";
import { MenuItem } from "react-pro-sidebar";

type TransactionFineDto = {
  title: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
  dateBorrowed: string;
  dueDate: string;
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
  React.useEffect(() => {
    console.log("Updated reportOutput:", reportOutput);
    console.log("Report output length > 0:", reportOutput.length > 0);
  }, [reportOutput]);

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
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const report = await response.json();
      console.log("API Response:", report);

      setReportOutput([report]);

    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    console.log(reportOutput);
    }
  };



    return (


<Stack spacing={2} direction="column" alignItems="center" sx={{ marginTop: "20px" }}>
        <Stack spacing={2} direction="row" alignItems="center" sx={{ marginTop: "20px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Start Date"
              value={selectedStartDate}
              onChange={(newDate) => setSelectedStartDate(newDate)}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select End Date"
              value={selectedEndDate}
              onChange={(newDate) => setSelectedEndDate(newDate)}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            onClick={handleCall}
            disabled={loading || (!selectedStartDate && !!selectedEndDate) || (!!selectedStartDate && !selectedEndDate)}
          >
            {loading ? "Loading..." : "Generate Report"}
          </Button>
        </Stack>
        {!loading && reportOutput.length > 0 && (
  <p style={{ whiteSpace: "pre-line", margin: "20px" }}> 

    {reportOutput[0].registeredUsersThatJoined > -1 &&
    `\nUsers That Registered Within Bounds: ${reportOutput[0].registeredUsersThatJoined}`
  }
    {"\n"}Registered Users: {reportOutput[0].registeredUsers}
    {"\n"}Outstanding Fines: {reportOutput[0].outstandingFines}

    {"\n\n"}--- Book Stats ---
    {"\n"}Titles: {reportOutput[0].bookTitleCount}
    {"\n"}Total Copies: {reportOutput[0].totalBookCount}
    {"\n"}Available: {reportOutput[0].availableBookCount}

    {"\n\n"}--- Movie Stats ---
    {"\n"}Titles: {reportOutput[0].movieTitleCount}
    {"\n"}Total Copies: {reportOutput[0].totalMovieCount}
    {"\n"}Available: {reportOutput[0].availableMovieCount}

    {"\n\n"}--- Music Stats ---
    {"\n"}Titles: {reportOutput[0].musicTitleCount}
    {"\n"}Total Copies: {reportOutput[0].totalMusicCount}
    {"\n"}Available: {reportOutput[0].availableMusicCount}

    {"\n\n"}--- Tech Stats ---
    {"\n"}Titles: {reportOutput[0].techTitleCount}
    {"\n"}Total Copies: {reportOutput[0].totalTechCount}
    {"\n"}Available: {reportOutput[0].availableTechCount}

    {"\n\n"}Total Titles: {reportOutput[0].totalTitleCount}
    {"\n"}Total Copies Across All Items: {reportOutput[0].totalCopiesCount}
    {"\n"}Total Available Items: {reportOutput[0].totalAvailableCount}

    {"\n\n"}Checkout Instances: {reportOutput[0].checkoutInstances}
    {"\n"}Unique Customers: {reportOutput[0].uniqueCustomers}

    {"\n\n"}--- Transaction Popularity ---
    {reportOutput[0].transactionPopularity.map((pop, index) => (
      `\n${index + 1}. ${pop.title} (${pop.itemType}) - ${pop.count} checkouts`
    )).join('')}

    {"\n\n"}--- Transactions with Fines ---
    {reportOutput[0].transactionFine.map((fine, index) => (
      `\n${index + 1}. ${fine.firstName} ${fine.lastName} (${fine.type}) - ${fine.title} | Borrowed: ${fine.dateBorrowed}, Due: ${fine.dueDate}, Fine: $${fine.amount}, Paid: ${fine.paymentStatus === 1 ? 'Yes' : 'No'}`
    )).join('')}
  </p>
)}

</Stack>



    );}