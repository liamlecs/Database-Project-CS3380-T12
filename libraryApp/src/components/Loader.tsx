// src/components/Loader.tsx
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      position="fixed"
      top={0}
      left={0}
      zIndex={9999}
      bgcolor="rgba(255, 255, 255, 0.8)" // Optional: overlay background
    >
      <CircularProgress size={80} />
    </Box>
  );
};

export default Loader;
