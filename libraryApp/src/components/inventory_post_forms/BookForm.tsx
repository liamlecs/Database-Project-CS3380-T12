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
        itemTypeID: 1, // Book
    });

    const [publishers, setPublishers] = useState<any[]>([]);
    const [genres, setGenres] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [genreRes, authorRes, publisherRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookGenre`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookAuthor`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Publisher`),
                ]);

                if (!genreRes.ok || !authorRes.ok || !publisherRes.ok) {
                    throw new Error("Failed to fetch dropdown options");
                }

                const [genreData, authorData, publisherData] = await Promise.all([
                    genreRes.json(),
                    authorRes.json(),
                    publisherRes.json(),
                ]);

                console.log("✅ Genres:", genreData);
                console.log("✅ Authors:", authorData);
                console.log("✅ Publishers:", publisherData);

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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                coverImagePath: URL.createObjectURL(file), // TEMP preview only
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🔍 Validation for required numeric fields
        if (
            !formData.publisherID ||
            !formData.bookGenreID ||
            !formData.bookAuthorID ||
            !formData.yearPublished ||
            !formData.totalCopies
        ) {
            alert("Please fill out all dropdowns and numeric fields.");
            return;
        }

        const payload = {
            title: formData.title,
            isbn: formData.isbn,
            publisherID: parseInt(formData.publisherID),
            bookGenreID: parseInt(formData.bookGenreID),
            bookAuthorID: parseInt(formData.bookAuthorID),
            yearPublished: parseInt(formData.yearPublished),
            totalCopies: parseInt(formData.totalCopies),
            coverImagePath: formData.coverImagePath || "",
            location: formData.location,
            itemTypeID: formData.itemTypeID,
        };
        


        console.log("Payload being sent:", payload);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Book/add-book`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
              });
              

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("Book added successfully!");
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
        } catch (err) {
            console.error("Error adding book:", err);
            alert("Failed to add book.");
        }
    };

    return (
        <form className="book-form" onSubmit={handleSubmit}>
            <h2>Add New Book</h2>
            <div className="form-grid">
                <input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
                <input name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleInputChange} />

                {/* Publisher Dropdown */}
                <select
                    name="publisherID"
                    value={formData.publisherID}
                    onChange={handleInputChange}
                    required
                    >
                    <option value="">Select Publisher</option>
                    {publishers.map((publisher, idx) => (
                        <option
                        key={publisher.publisherId ?? idx}
                        value={String(publisher.publisherId)}
                        >
                        {publisher.publisherName ?? "Unknown Publisher"}
                        </option>
                    ))}
                </select>

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
                    <option value="">Select Author</option>
                    {authors.map((author) => (
                        <option key={author.bookAuthorId} value={author.bookAuthorId}>
                            {author.firstName} {author.lastName}
                        </option>
                    ))}
                </select>

                <input
                    list="year-options"
                    name="yearPublished"
                    value={formData.yearPublished}
                    onChange={handleInputChange}
                />
                <datalist id="year-options">
                    {Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 2025 - i).map((year) => (
                        <option key={year} value={year} />
                    ))}
                </datalist>

                <input
                    name="totalCopies"
                    placeholder="Total Copies"
                    type="number"
                    value={formData.totalCopies}
                    onChange={handleInputChange}
                />
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
            </div>
            <button type="submit">Add Book</button>
        </form>
    );
};

export default BookForm;
