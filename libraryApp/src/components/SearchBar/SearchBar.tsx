import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (filters: { title: string; author: string; genre: string; isCheckedOut: boolean }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [isCheckedOut] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ title, author, genre, isCheckedOut });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search by Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Search by Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />
            <input
                type="text"
                placeholder="Search by Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
