
export interface BookDto {
    itemId: number;
    bookId: number;
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
    itemId: number;
    movieId: number;
    upc: string;
    yearReleased: number;
    format: string;
    coverImagePath: string;
    title: string;
    director: string;
    directorFirstName: string;
    directorLastName: string;
    genre: string;
    totalCopies: number;
    availableCopies: number;
    itemLocation: string;
    itemTypeId: number;
    movieGenreId: number;
    movieDirectorId: number;
  }
  
  export interface MusicDto {
    itemId: number;
    songId: number;
    musicArtistID: number;
    musicGenreID: number;
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

  export interface Item {
    itemId: number;
    title: string;
    availabilityStatus: string;
    totalCopies: number;
    availableCopies: number;
    location?: string;
  }

  export interface EventData {
    eventId: number;
    title: string;
    startTimestamp: string;
    endTimestamp: string;
    location: string;
    ageGroup: number;
    categoryId: number;
    isPrivate: boolean;
    description: string;
  }
  
  export interface EmployeeData {
    employeeId: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    supervisorID?: number;
    username: string;
    password?: string;
  }
  
  export interface EditEmployeeDialogProps {
    open: boolean;
    employee: EmployeeData | null;
    onClose: () => void;
    onSave: (updatedData: EmployeeData) => void;
  }