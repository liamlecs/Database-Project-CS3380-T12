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
                const [genreRes, authorRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookGenre`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/BookAuthor`)
                ]);

                if (!genreRes.ok || !authorRes.ok) {
                    throw new Error("Failed to fetch dropdown options");
                }

                const [genreData, authorData] = await Promise.all([
                    genreRes.json(),
                    authorRes.json()
                ]);

                console.log("✅ Genres:", genreData);
                console.log("✅ Authors:", authorData);

                setGenres(genreData);
                setAuthors(authorData);
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
                coverImagePath: URL.createObjectURL(file), // TEMP: for local preview
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Book/add-book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    publisherID: parseInt(formData.publisherID),
                    bookGenreID: parseInt(formData.bookGenreID),
                    bookAuthorID: parseInt(formData.bookAuthorID),
                    yearPublished: parseInt(formData.yearPublished),
                    totalCopies: parseInt(formData.totalCopies),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("Book added successfully!");
            setFormData({
                ...formData,
                title: "",
                isbn: "",
                publisherID: "",
                bookGenreID: "",
                bookAuthorID: "",
                yearPublished: "",
                totalCopies: "",
                coverImagePath: "",
                location: "",
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

                {/* Publisher Dropdown (will work once backend is ready) */}
                <select name="publisherID" value={formData.publisherID} onChange={handleInputChange}>
                    <option value="">Select Publisher</option>
                    {publishers.map((publisher) => (
                        <option key={publisher.publisherID} value={publisher.publisherID}>
                            {publisher.publisherName}
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
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <input name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
            </div>
            <button type="submit">Add Book</button>
        </form>
    );
};

export default BookForm;
