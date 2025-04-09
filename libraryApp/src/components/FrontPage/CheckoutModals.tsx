import React from "react";
import { Book } from "../../types/Book";

interface CheckoutModalProps {
    book: Book;
    onConfirm: () => void;
    onCancel: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ book, onConfirm, onCancel }) => {
    return (
        <div className="checkout-modal">
            <div className="modal-content">
                <h2>Confirm Checkout</h2>
                <div className="book-info">
                    <p className="book-title">Title: {book.title}</p>
                    <p className="book-author">Author: {book.author}</p>
                    <p className="book-genre">Genre: {book.genre}</p>
                    <p className="book-summary">Summary: A book about {book.genre}.</p>
                </div>
                <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
                <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default CheckoutModal;