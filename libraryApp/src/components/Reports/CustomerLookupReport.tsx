import { Stack, FormControl, InputLabel, Select, Button, TextField } from "@mui/material";
import React from "react";
import { MenuItem } from "react-pro-sidebar";

export default function TermsAndConditionsPage() {
  const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
  const [reportOutput, setReportOutput] = React.useState<{ email: string; firstName: string; lastName: string; type: string; membershipStartDate: string; membershipEndDate: string; borrowingLimit: number; emailConfirmed: boolean; }[] //CHANGE THIS (why does this work without changing anything?)
  >([]);
  React.useEffect(() => {
    console.log("Updated reportOutput:", reportOutput);
    console.log("Report output length > 0:", reportOutput.length > 0);
  }, [reportOutput]);

const handleCall = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Customer/by-email/${encodeURIComponent(email)}` //CHANGE THIS
      );
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



<p style={{ whiteSpace: "pre-line" }}> 
    {reportOutput[0].type} {reportOutput[0].firstName} {reportOutput[0].lastName}, with email {reportOutput[0].email}, has a borrowing limit of {reportOutput[0].borrowingLimit}.
    They began their membership on {reportOutput[0].membershipStartDate} and it will expire on {reportOutput[0].membershipEndDate}.
    This user's email is currently {reportOutput[0].emailConfirmed ? "confirmed" : "not confirmed"}.

</p>

        )}
</Stack>



    );}