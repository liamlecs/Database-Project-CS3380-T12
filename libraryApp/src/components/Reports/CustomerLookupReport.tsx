import { Stack, FormControl, InputLabel, Select, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { MenuItem } from "react-pro-sidebar";

export default function TermsAndConditionsPage() {
  const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
  const [reportOutput, setReportOutput] = React.useState<{ email: string; firstName: string; lastName: string; type: string; membershipStartDate: string; membershipEndDate: string; borrowingLimit: number; emailConfirmed: boolean; }[] //CHANGE THIS (why does this work without changing anything?)
  >([]);

  const [transactionReportOutput, setTransactionReportOutput] = React.useState<{
    email: string;
    title: string;
    typeName: string;
    dateBorrowed: string; // using string since DateOnly serializes to ISO string
    dueDate: string;
    returnDate: string;
  }[]>([]);
  

  const [waitlistReportOutput, setWaitlistReportOutput] = React.useState<{
    email: string;
    title: string;
    typeName: string;
    reservationDate: string; // DateTime comes as ISO string too
    waitlistPosition: number;
  }[]>([]);
  
  const [fineReportOutput, setFineReportOutput] = React.useState<{
    email: string;
    title: string;
    typeName: string;
    amount: number;
    issueDate: string; // DateOnly will come as ISO string from API
    paymentStatus: boolean;
  }[]>([]);
  

  React.useEffect(() => {
    console.log("Updated reportOutput:", reportOutput);
    console.log("Report output length > 0:", reportOutput.length > 0);
  }, [reportOutput]);

const handleCall = async () => {
    setLoading(true);

    try {
      const response1 = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Customer/by-email/${encodeURIComponent(email)}` //CHANGE THIS
      );
      if (!response1.ok) {
        throw new Error(`Failed to fetch events: ${response1.statusText}`);
      }

      const response2 = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/CustomerTransactions/${encodeURIComponent(email)}` //CHANGE THIS
      );
      if (!response1.ok) {
        throw new Error(`Failed to fetch events: ${response2.statusText}`);
      }

      const response3 = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/CustomerWaitlists/${encodeURIComponent(email)}` //CHANGE THIS
      );
      if (!response1.ok) {
        throw new Error(`Failed to fetch events: ${response3.statusText}`);
      }
      const response4 = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Fine/CustomerFines/${encodeURIComponent(email)}` //CHANGE THIS
      );
      if (!response1.ok) {
        throw new Error(`Failed to fetch events: ${response4.statusText}`);
      }

      const generalReport = await response1.json();
      const transactionReport = await response2.json();
      const waitlistReport = await response3.json();
      const fineReport = await response4.json();
      console.log("API General Response:", generalReport);
      console.log("API Transaction Response:", transactionReport);
      console.log("API Waitlist Response:", waitlistReport);
      console.log("API Fine Response:", fineReport);

      setReportOutput([generalReport]);
      setTransactionReportOutput(transactionReport);
      setWaitlistReportOutput(waitlistReport);
      setFineReportOutput(fineReport);

    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };



    return (


<Stack spacing={2} direction="column" alignItems="center" sx={{ marginTop: "20px" }}>
        <Stack spacing={2} direction="row" alignItems="center" sx={{ marginTop: "20px" }}>
        <TextField id="outlined1" label="Email" variant="outlined" value={email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
setEmail(event.target.value);
        }}/>
          <Button
            variant="contained"
            onClick={handleCall}
            disabled={loading || !email}
          >
            {loading ? "Loading..." : "Generate Report"}
          </Button>
        </Stack>
        {loading === false && reportOutput.length > 0 && (



<Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ width: "80%", mt: 4 }}>
  <Card sx={{ minWidth: 300, p: 2, borderRadius: 3, boxShadow: 3 }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">User Summary</Typography>
      <Typography variant="body1">
        <strong>{reportOutput[0].type}</strong><br />
        {reportOutput[0].firstName} {reportOutput[0].lastName}
      </Typography>
      <Typography variant="body2" mt={1}>
        <strong>Email:</strong> {reportOutput[0].email}
      </Typography>
      <Typography variant="body2" mt={1}>
        <strong>Borrowing Limit:</strong> {reportOutput[0].borrowingLimit}
      </Typography>
    </CardContent>
  </Card>

  <Card sx={{ minWidth: 300, p: 2, borderRadius: 3, boxShadow: 3 }}>
  <CardContent>
    <Typography variant="subtitle2" color="text.secondary">Membership & Email</Typography>
    <Typography
      variant="body1"
      sx={{
        
        color: reportOutput[0].emailConfirmed ? "#2e7d32" : "#d32f2f",
        mt: 1,
      }}
    >
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


{transactionReportOutput.length > 0 && (
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
          {transactionReportOutput.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<TableRow key={index}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.typeName}</TableCell>
              <TableCell>{new Date(item.dateBorrowed).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {item.returnDate === "0001-01-01"
                  ? "Not returned"
                  : new Date(item.returnDate).toLocaleDateString()}
              </TableCell>
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
              <TableCell>
                {item.waitlistPosition === -1
                  ? "Already received"
                  : item.waitlistPosition}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Stack>
)}

{fineReportOutput.length > 0 && (
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
          {fineReportOutput.map((item, index) => (
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



    );}