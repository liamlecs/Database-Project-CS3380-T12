import React, { useEffect, useState } from "react";
import { Button, Paper, Box } from "@mui/material";

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
        // Filter for items that have not been returned yet
        const outstanding = data.filter((t: Transaction) => t.returnDate === null);
        setTransactions(outstanding);
      });
  }, []);

  const handleReturn = async (transaction: Transaction) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const due = new Date(transaction.dueDate);
    const isLate = today > due;

    // call Return API
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/Return/${transaction.transactionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnDate: todayStr }),
      }
    );

    alert("Item returned successfully.");

    // remove item from the list after successfully returned
    setTransactions((prev) =>
      prev.filter((t) => t.transactionId !== transaction.transactionId)
    );
  };

  return (
    <Box
      sx={{
        // Add top margin so global NavBar won't hide this content
        mt: "80px",
        px: 2,
      }}
    >
      <Paper style={{ padding: "2rem" }}>
        <h2>Your Checked Out Items</h2>
        {transactions.map((t) => {
          const dueDate = new Date(t.dueDate);
          const isOverdue = new Date() > dueDate;

          return (
            <div
              key={t.transactionId}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: isOverdue ? "#ffe0e0" : "#f0f0f0",
                borderLeft: isOverdue ? "6px solid red" : "6px solid green",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                {t.title}
              </div>
              <div>
                <span>Due: {dueDate.toLocaleDateString()}</span>
                {isOverdue && (
                  <span
                    style={{ color: "red", marginLeft: "1rem", fontWeight: 500 }}
                  >
                    Overdue!
                  </span>
                )}
              </div>
              <Button
                variant="contained"
                onClick={() => handleReturn(t)}
                style={{ marginTop: "0.5rem" }}
              >
                Return
              </Button>
            </div>
          );
        })}
      </Paper>
    </Box>
  );
};

export default Return;
