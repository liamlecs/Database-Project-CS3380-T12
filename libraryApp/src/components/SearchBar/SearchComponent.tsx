import { useState } from 'react';
import Dropdown from '../SearchBar/Dropdown';
import './SearchComponent.css';

import { FC } from 'react';


interface Book {
    title: string;
    author: string;
    genre: string;
    isCheckedOut: boolean;
}

interface Filters {
    itemType: string;
    author: string;
    genre: string;
    fields: string;
    generalSearch: string;
    isCheckedOut: boolean;
}

interface SearchComponentProps {
    books: Book[];
    onSearch: (filters: Filters) => void;
}

const SearchComponent: FC<SearchComponentProps> = ({ books, onSearch }) => {
    const [filters, setFilters] = useState<Filters>({ itemType: "", author: "", genre: "", fields: "", generalSearch: "", isCheckedOut: false });

    const uniqueItemType = Array.from(new Set(books.map(book => book.title)));
    const uniqueField = Array.from(new Set(books.map(book => book.author)));

    return (
        <div className="search-container">
            {/* Item Type Dropdown */}
            <Dropdown
                label="Item Type"
                options={uniqueItemType}
                value={filters.itemType}
                onChange={(value) => setFilters({ ...filters, itemType: value })}
            />

            {/* Fields Dropdown Dropdown */}
            <Dropdown
                label="Fields"
                options={uniqueField}
                value={filters.fields}
                onChange={(value) => setFilters({ ...filters, fields: value })}
            />

            {/* Genearal Search Text Input */}
            <div className="search-field">
                <label>Search</label>
                <input
                    type="text"
                    value={filters.generalSearch}
                    onChange={(e) => setFilters({ ...filters, generalSearch: e.target.value })}
                />
            </div>

            <button className="search-btn" onClick={() => onSearch(filters)}>Search</button>
        </div>
    );
};

export default SearchComponent;
