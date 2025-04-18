
export interface BookDto {
    bookId: number;
    itemId: number;
    itemTypeId: number;
    title: string;
    isbn: string;
    publisher: string;
    genre: string;
    author: string;
    authorFirstName: string;
    authorLastName: string;
    yearPublished: number;
    availableCopies: number;
    totalCopies: number;
    coverImagePath: string;
    itemLocation: string;
    publisherId: number;
    bookGenreId: number;
    bookAuthorId: number;
  }

  export interface MovieDto {
    movieId: number;
    upc: string;
    yearReleased: number;
    format: string;
    coverImagePath: string;
    itemId: number;
    title: string;
    director: string;
    directorFirstName: string;
    directorLastName: string;
    genre: string;
    totalCopies: number;
    availableCopies: number;
    itemLocation: string;
  }
  
  export interface MusicDto {
    musicId: number;
    itemId: number;
    itemTypeId: number;
    title: string;
    artistName: string;
    genreDescription: string;
    format: string;
    availableCopies: number;
    totalCopies: number;
    coverImagePath: string;
    location: string
  }
  
  export interface TechnologyDto {
    deviceId: number;
    itemId: number;
    itemTypeId: number;
    title: string;
    deviceTypeName: string;
    manufacturerName: string;
    modelNumber: string;
    availableCopies: number;
    totalCopies: number;
    coverImagePath: string;
    location: string;
  }