import { Book } from "../types/Book";

export const transformBookData = (data: any): Book[] => {
  return data.map((item: any) => ({
    bookId: item.bookId,
    title: item.isbn, // Assuming `isbn` is used as the title
    author: `${item.bookAuthor.firstName} ${item.bookAuthor.lastName}`,
    genre: item.bookGenre.description,
    imageUrl: "https://via.placeholder.com/130", // Placeholder image
  }));
};