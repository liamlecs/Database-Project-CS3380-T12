import { AppBar, Toolbar, Button, Container } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function ReportsOutput() {
  return (
    <div>
      {/* Top Navigation Bar */}
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", gap: "20px" }}>
          <Button color="inherit" component={Link} to="customerlookupreport">
            Customer Lookup
          </Button>
          <Button color="inherit" component={Link} to="itemfinereport">
            Item Fines
          </Button>
          <Button color="inherit" component={Link} to="popularityreport">
            Item Popularity
          </Button>
          <Button color="inherit" component={Link} to="mastertransactionreport">
            Master Transaction Report
          </Button>
        </Toolbar>
      </AppBar>

      {/* Page Content Below */}
      <Container sx={{ marginTop: "20px" }}>
        <Outlet /> {/* Renders the selected report */}
      </Container>
    </div>
  );
}
