// Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar"; // adjust path if needed
import Footer from "./Footer"; // adjust path if needed
import { Box } from "@mui/material";
import BackToTopButton from "./BackToTopButton.tsx";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Ensures the layout takes up full viewport height
        position: "relative", // Add this for proper positioning context
      }}
    >
      {/* Global Navigation Bar */}
      <NavBar />

      {/* Main content area - flexGrow makes it expand to take available space */}
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Back to Top Button - positioned outside main content flow */}
      <BackToTopButton />


      {/* Footer stays at the bottom */}
      <Footer />
    </Box>
  );
}
