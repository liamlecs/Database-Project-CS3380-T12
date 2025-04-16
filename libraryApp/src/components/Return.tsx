import React, { useEffect, useState } from "react";
import { Button, Paper, Box, Typography } from "@mui/material";

interface Transaction {
  transactionId: number;
  title: string;
  dueDate: string;
  itemId: number;
  dateBorrowed: string;
  returnDate: string | null;
}

const Return: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        // Only keep items that have not been returned
        const outstanding = data.filter((t: Transaction) => t.returnDate === null);
        setTransactions(outstanding);
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);

  const handleReturn = async (transaction: Transaction) => {
    const todayStr = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
    
    // Call Return API
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/Return/${transaction.transactionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnDate: todayStr }),
      }
    );

    // increase AvailableCopies in inventory after return
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Item/update-copies`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: transaction.itemId,
        changeInCopies: 1,
      }),
    });

       // Check if overdue
       const dueDate = new Date(transaction.dueDate);
       const isOverdue = new Date() > dueDate;
   
       // Create alert message
       const message = isOverdue 
         ? `"${transaction.title}" returned successfully. However, you have been assigned a fine.`
         : `"${transaction.title}" returned successfully.`;
   
       alert(message);

    // Remove returned item from the state
    setTransactions((prev) =>
      prev.filter((t) => t.transactionId !== transaction.transactionId)
    );
  };


  return (
    <Box
      sx={{
        // Enough top margin so it won't be hidden by the navbar
        mt: "80px",
        // Some horizontal padding
        px: 2,
        // Center everything horizontally
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          // Make the paper narrower and center its content
          width: "100%",
          maxWidth: 700,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // centers everything horizontally inside the Paper
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Your Checked Out Items
        </Typography>

        {transactions.map((t) => {
          const dueDate = new Date(t.dueDate);
          const isOverdue = new Date() > dueDate;

          return (
            <Box
              key={t.transactionId}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                textAlign: "center",
                backgroundColor: isOverdue ? "#ffe0e0" : "#f0f0f0",
                borderLeft: isOverdue ? "6px solid red" : "6px solid green",
                width: "100%",
                maxWidth: 500,        // narrower content box
                mx: "auto",           // center horizontally
              }}
            >
              <Typography fontWeight={600} fontSize="1.1rem">
                {t.title}
              </Typography>
              <Box>
                <span>Due: {dueDate.toLocaleDateString()}</span>
                {isOverdue && (
                  <span style={{ color: "red", marginLeft: "1rem", fontWeight: 500 }}>
                    Overdue!
                  </span>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={() => handleReturn(t)}
                sx={{ mt: 1 }}
              >
                Return
              </Button>
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
};

export default Return;
