import { useState, useEffect } from "react";

interface SelectedBook {
  itemType: string;
  itemID: string;
  title: string;
}

interface LibraryCheckoutProps {
  selectedBook?: SelectedBook | null;
}

const LibraryCheckout = ({ selectedBook }: LibraryCheckoutProps) => {
  interface Book {
    itemID: string;
    itemType: string;
    title: string;
    borrowerType: string;
  }
  
  const [books, setBooks] = useState<Book[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const booksPerPage = 7;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Items`)
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error("Error fetching books:", error));
  };

  // (Optional) Use selectedBook somewhere if needed:
  // console.log("Selected Book:", selectedBook);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Library Checkout</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Item ID</th>
              <th className="border p-2">Item Type</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Checked Out</th>
              <th className="border p-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {books.slice(startIndex, startIndex + booksPerPage).map((book, index) => {
              const checkoutDate = new Date().toISOString().split("T")[0];
              const dueDate = new Date();
              dueDate.setDate(dueDate.getDate() + (book.borrowerType === "faculty" ? 14 : 7));
              return (
                <tr key={index} className="border">
                  <td className="border p-2">{book.itemID}</td>
                  <td className="border p-2">{book.itemType}</td>
                  <td className="border p-2">{book.title}</td>
                  <td className="border p-2">{checkoutDate}</td>
                  <td className="border p-2">{dueDate.toISOString().split("T")[0]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {/* Pagination or scroll controls */}
      </div>
    </div>
  );
};

export default LibraryCheckout;
