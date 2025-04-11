import {
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";

export default function TermsAndConditionsPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [validInformation, setValidInformation] = React.useState("");

  const [reportOutput, setReportOutput] = React.useState<{
    email: string;
    firstName: string;
    lastName: string;
    type: string;
    membershipStartDate: string;
    membershipEndDate: string;
    borrowingLimit: number;
    emailConfirmed: boolean;
  }[]>([]);

  const [transactionReportOutput, setTransactionReportOutput] = React.useState<{
    email: string;
    title: string;
    typeName: string;
    dateBorrowed: string;
    dueDate: string;
    returnDate: string;
  }[]>([]);

  const [displayedTransactions, setDisplayedTransactions] = React.useState<typeof transactionReportOutput>([]);

  const [waitlistReportOutput, setWaitlistReportOutput] = React.useState<{
    email: string;
    title: string;
    typeName: string;
    reservationDate: string;
    waitlistPosition: number;
  }[]>([]);

  const [fineReportOutput, setFineReportOutput] = React.useState<{
    email: string;
    title: string;
    typeName: string;
    amount: number;
    issueDate: string;
    paymentStatus: boolean;
  }[]>([]);

  const [displayedFines, setDisplayedFines] = React.useState<typeof fineReportOutput>([]);

  const filterTransactions = (data: typeof transactionReportOutput) => {
    if (validInformation === "1") return data.filter(item => item.returnDate === "0001-01-01");
    if (validInformation === "0") return data.filter(item => item.returnDate !== "0001-01-01");
    return data;
  };

  const filterFines = (data: typeof fineReportOutput) => {
    if (validInformation === "1") return data.filter(item => !item.paymentStatus);
    if (validInformation === "0") return data.filter(item => item.paymentStatus);
    return data;
  };

  const handleCall = async () => {
    setLoading(true);
    try {
      const response1 = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Customer/by-email/${encodeURIComponent(email)}`
      );
      const response2 = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/CustomerTransactions/${encodeURIComponent(email)}`
      );
      const response3 = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/CustomerWaitlists/${encodeURIComponent(email)}`
      );
      const response4 = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Fine/CustomerFines/${encodeURIComponent(email)}`
      );

      if (!response1.ok || !response2.ok || !response3.ok || !response4.ok) {
        throw new Error("One or more requests failed");
      }

      const generalReport = await response1.json();
      const transactionReport = await response2.json();
      const waitlistReport = await response3.json();
      const fineReport = await response4.json();

      setReportOutput([generalReport]);
      setTransactionReportOutput(transactionReport);
      setWaitlistReportOutput(waitlistReport);
      setFineReportOutput(fineReport);

      setDisplayedTransactions(filterTransactions(transactionReport));
      setDisplayedFines(filterFines(fineReport));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} direction="column" alignItems="center" sx={{ marginTop: "20px" }}>
      <Stack spacing={2} direction="row" alignItems="center" sx={{ width: "80%", marginTop: "20px" }}>
        <FormControl sx={{ flex: 1 }}>
          <TextField
            id="outlined1"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormControl>

        <FormControl sx={{ flex: 1 }}>
          <InputLabel id="paymentStatus-label">Customer History Type (Optional)</InputLabel>
          <Select
            labelId="paymentStatus-label"
            value={validInformation}
            label="Customer History Type"
            fullWidth
            onChange={(event) => setValidInformation(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">Archival</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleCall}
          disabled={loading || !email}
          sx={{ height: "56px" }}
        >
          {loading ? "Loading..." : "Generate Report"}
        </Button>
      </Stack>

      {reportOutput.length > 0 && (
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ width: "80%", mt: 4 }}>
          <Card sx={{ minWidth: 300, p: 2, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">User Summary</Typography>
              <Typography variant="body1">
                <strong>{reportOutput[0].type}</strong><br />
                {reportOutput[0].firstName} {reportOutput[0].lastName}
              </Typography>
              <Typography variant="body2" mt={1}><strong>Email:</strong> {reportOutput[0].email}</Typography>
              <Typography variant="body2" mt={1}><strong>Borrowing Limit:</strong> {reportOutput[0].borrowingLimit}</Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 300, p: 2, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Membership & Email</Typography>
              <Typography variant="body1" sx={{ color: reportOutput[0].emailConfirmed ? "#2e7d32" : "#d32f2f", mt: 1 }}>
                {reportOutput[0].emailConfirmed ? "Email Confirmed" : "Email Not Confirmed"}
              </Typography>
              <Typography variant="body2" mb={1}>
                Start: <strong>{new Date(reportOutput[0].membershipStartDate).toLocaleDateString()}</strong><br />
                End: <strong>{new Date(reportOutput[0].membershipEndDate).toLocaleDateString()}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      )}

      {displayedTransactions.length > 0 && (
        <Stack width="80%" mt={4} mb={6}>
          <h3>Transaction History</h3>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date Borrowed</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Return Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedTransactions.map((item, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableRow key={index}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.typeName}</TableCell>
                    <TableCell>{new Date(item.dateBorrowed).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{item.returnDate === "0001-01-01" ? "Not returned" : new Date(item.returnDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}

      {waitlistReportOutput.length > 0 && (
        <Stack width="80%" mt={4}>
          <h3>Waitlist Status</h3>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reservation Date</TableCell>
                  <TableCell>Waitlist Position</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {waitlistReportOutput.map((item, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableRow key={index}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.typeName}</TableCell>
                    <TableCell>{new Date(item.reservationDate).toLocaleDateString()}</TableCell>
                    <TableCell>{item.waitlistPosition === -1 ? "Already received" : item.waitlistPosition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}

      {displayedFines.length > 0 && (
        <Stack width="80%" mt={4}>
          <h3>Fines</h3>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedFines.map((item, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableRow key={index}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.typeName}</TableCell>
                    <TableCell>{new Date(item.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>${item.amount.toFixed(2)}</TableCell>
                    <TableCell>{item.paymentStatus ? "Paid" : "Unpaid"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </Stack>
  );
}