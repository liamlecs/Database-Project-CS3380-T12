import React, { useState, useEffect } from "react";
import "./BookForm.css";

const BookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publisherID: "",
    bookGenreID: "",
    bookAuthorID: "",
    yearPublished: "",
    totalCopies: "",
    coverImagePath: "",
    location: "",
    itemTypeID: 1, // default item type for Book
  });

  const [publishers, setPublishers] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  // State for new entries when "Other" is selected:
  const [newPublisherName, setNewPublisherName] = useState("");
  const [newAuthorFirstName, setNewAuthorFirstName] = useState("");
  const [newAuthorLastName, setNewAuthorLastName] = useState("");

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [genreRes, authorRes, publisherRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookGenre`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookAuthor`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Publisher`)
        ]);

        if (!genreRes.ok || !authorRes.ok || !publisherRes.ok) {
          throw new Error("Failed to fetch dropdown options");
        }

        const [genreData, authorData, publisherData] = await Promise.all([
          genreRes.json(),
          authorRes.json(),
          publisherRes.json()
        ]);

        console.log("Publishers:", publisherData); // Check the output

        setGenres(genreData);
        setAuthors(authorData);
        setPublishers(publisherData);
      } catch (err) {
        console.error("Dropdown fetch error:", err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`DEBUG: name=${name}, value=${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create FormData and append the file under the field name "Cover"
      const formDataToUpload = new FormData();
      formDataToUpload.append("Cover", file);
  
      try {
        // Send the file to your upload-cover API endpoint
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Book/upload-cover`, {
          method: "POST",
          body: formDataToUpload,
        });
  
        if (!res.ok) {
          throw new Error("Image upload failed");
        }
  
        // Parse the response to retrieve the permanent URL
        const data = await res.json();
        
        // Update your form state with the permanent URL (data.url)
        setFormData((prev) => ({
          ...prev,
          coverImagePath: data.url,
        }));
      } catch (err) {
        console.error("Error uploading cover image:", err);
        // Optionally set an error state or display feedback to the user here.
      }
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Handle "Other" for Publisher if needed.
      let finalPublisherID: number;
      if (formData.publisherID === "other") {
        const createPubRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Publisher`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publisherName: newPublisherName
          })
        });
        if (!createPubRes.ok) {
          throw new Error("Failed to create Publisher");
        }

          // Extract only the integer ID from the returned object
        const newPublisherObj = await createPubRes.json();  
        // e.g. { publisherId: 13, publisherName: "Riot", books: [] }
        finalPublisherID = newPublisherObj.publisherId; // store the integer only
      } else {
        finalPublisherID = parseInt(formData.publisherID, 10);
      }

      // Handle "Other" for Author if needed.
      let finalAuthorID: number;
      if (formData.bookAuthorID === "other") {
        const createAuthorRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookAuthor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: newAuthorFirstName,
            lastName: newAuthorLastName
          })
        });
        if (!createAuthorRes.ok) {
          throw new Error("Failed to create Author");
        }
        const newAuthorObj = await createAuthorRes.json();
        // e.g. { bookAuthorId: 17, firstName: "Riot", lastName: "Games", books: [] }
        finalAuthorID = newAuthorObj.bookAuthorId; // integer only
      } else {
        finalAuthorID = parseInt(formData.bookAuthorID, 10);
      }

      // Proceed with creating the Book record (and the underlying Item)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Book/add-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          publisherID: finalPublisherID,
          bookGenreID: parseInt(formData.bookGenreID, 10),
          bookAuthorID: finalAuthorID,
          yearPublished: parseInt(formData.yearPublished, 10),
          totalCopies: parseInt(formData.totalCopies, 10)
          // coverImagePath, location and itemTypeID are passed as is.
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Book added successfully!");
      // Reset form fields.
      setFormData({
        title: "",
        isbn: "",
        publisherID: "",
        bookGenreID: "",
        bookAuthorID: "",
        yearPublished: "",
        totalCopies: "",
        coverImagePath: "",
        location: "",
        itemTypeID: 1,
      });
      setNewPublisherName("");
      setNewAuthorFirstName("");
      setNewAuthorLastName("");
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book.");
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2 style={{ textAlign: "center", width: "100%" }}>Add New Book</h2>
      <div className="form-grid">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
        <input name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleInputChange} />

        {/* Publisher Dropdown */}
        <select name="publisherID" value={formData.publisherID} onChange={handleInputChange}>
        <option key="defaultPublisher" value="">Select Publisher</option>
        {publishers.map((publisher) => (
            <option key={publisher.publisherId} value={publisher.publisherId}>
            {publisher.publisherName}
            </option>
        ))}
        <option key="otherPublisher" value="other">Other</option>
        </select>

        {/* If "Other" is selected, show an input for new Publisher Name */}
        {formData.publisherID === "other" && (
          <input
            type="text"
            placeholder="New Publisher Name"
            value={newPublisherName}
            onChange={(e) => setNewPublisherName(e.target.value)}
          />
        )}

        {/* Genre Dropdown */}
        <select name="bookGenreID" value={formData.bookGenreID} onChange={handleInputChange}>
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.bookGenreId} value={genre.bookGenreId}>
              {genre.description}
            </option>
          ))}
        </select>

        {/* Author Dropdown */}
        <select name="bookAuthorID" value={formData.bookAuthorID} onChange={handleInputChange}>
  <option key="defaultAuthor" value="">Select Author</option>
  {authors.map((author) => (
    <option key={author.bookAuthorId} value={author.bookAuthorId}>
      {author.firstName} {author.lastName}
    </option>
  ))}
  <option key="otherAuthor" value="other">Other</option>
</select>

        {/* If "Other" is selected, show inputs for new Author details */}
        {formData.bookAuthorID === "other" && (
          <>
            <input
              type="text"
              placeholder="Author's First Name"
              value={newAuthorFirstName}
              onChange={(e) => setNewAuthorFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author's Last Name"
              value={newAuthorLastName}
              onChange={(e) => setNewAuthorLastName(e.target.value)}
            />
          </>
        )}

        <input
          name="yearPublished"
          placeholder="Year Published"
          type="number"
          value={formData.yearPublished}
          onChange={handleInputChange}
        />
        <input
          name="totalCopies"
          placeholder="Total Copies"
          type="number"
          value={formData.totalCopies}
          onChange={handleInputChange}
        />
        {/* Cover image file input */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
};

export default BookForm;
