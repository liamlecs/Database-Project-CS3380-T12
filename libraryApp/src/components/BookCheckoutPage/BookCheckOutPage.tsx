import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Book {
  itemType: string;
  itemID: string;
  title: string;
}

interface LibraryCheckoutProps {
  selectedBook: Book | null; // The selected book passed from the previous page
}

const LibraryCheckout = ({ selectedBook }: LibraryCheckoutProps) => {
  const [borrowerType, setBorrowerType] = useState("student");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Set up initial values when the book is selected
  useEffect(() => {
    if (selectedBook) {
      setCheckoutDate(new Date().toISOString().split("T")[0]); // Set checkout date to today
      updateDueDate(new Date().toISOString().split("T")[0], borrowerType); // Update due date based on today's date
    }
  }, [selectedBook, borrowerType]);

  // Update due date based on borrower type (7 days for student, 14 days for faculty)
  const updateDueDate = (date: string, type: string) => {
    if (!date) return;
    const checkout = new Date(date);
    checkout.setDate(checkout.getDate() + (type === "faculty" ? 14 : 7));
    setDueDate(checkout.toISOString().split("T")[0]);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBook) {
      alert("No book selected.");
      return;
    }

    const checkoutData = {
      ...selectedBook, // Include the selected book details
      borrowerType,
      checkoutDate,
      dueDate,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      if (response.ok) {
        alert("Checkout successful!");
      } else {
        alert("Checkout failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Library Checkout</h2>
      {selectedBook ? (
        <div>
          {/* Summary Table */}
          <table className="min-w-full table-auto border-collapse mb-4">
            <thead>
              <tr>
                <th className="border p-2">Item ID</th>
                <th className="border p-2">Item Type</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Checkout Date</th>
                <th className="border p-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{selectedBook.itemID}</td>
                <td className="border p-2">{selectedBook.itemType}</td>
                <td className="border p-2">{selectedBook.title}</td>
                <td className="border p-2">{checkoutDate}</td>
                <td className="border p-2">{dueDate}</td>
              </tr>
            </tbody>
          </table>

          {/* Borrower Type Selection */}
          <div className="mb-4">
            <label className="block">Borrower Type:</label>
            <select
              className="border p-2 w-full"
              value={borrowerType}
              onChange={(e) => {
                setBorrowerType(e.target.value);
                updateDueDate(checkoutDate, e.target.value);
              }}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 mt-4 w-full rounded"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      ) : (
        <p>No book selected.</p>
      )}
    </div>
  );
};

export default LibraryCheckout;
