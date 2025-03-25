using LibraryWebAPI.Data; // Ensure this matches the namespace where LibraryDbContext is defined
using LibraryWebAPI.Models; // Add this if LibraryDbContext is in the Models namespace


public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider, IHostEnvironment env)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<LibraryContext>();

        // Check if data already exists
        if (context.Books.Any())
            return;

        // Seed Publishers
        var publisher1 = new Publisher { PublisherId = 123, PublisherName = "123 Publisher St" };
        var publisher2 = new Publisher { PublisherId = 234, PublisherName = "456 Penguin Ave" };
        var publisher3 = new Publisher { PublisherId = 345, PublisherName ="789 Collins Rd" };
        
        context.Publishers.AddRange(publisher1, publisher2, publisher3);

        // Seed Genres
        var genreFiction = new BookGenre { BookGenreId = 0 , Description = "Childrens Books"};
        var genreNonFiction = new BookGenre { BookGenreId = 1, Description = "Educational Books" };
        var genreClassics = new BookGenre { BookGenreId = 3, Description = "Classical Novels"};
        
        context.BookGenres.AddRange(genreFiction, genreNonFiction, genreClassics);


        // Seed Authors
        var author1 = new BookAuthor { BookAuthorId = 011, FirstName = "George", LastName =  "Orwell"};
        var author2 = new BookAuthor { BookAuthorId = 022, FirstName = "J.K.", LastName = "Rowling" };
        var author3 = new BookAuthor { BookAuthorId = 033, FirstName = "Harper", LastName = "Lee" };
        var author4 = new BookAuthor { BookAuthorId = 044, FirstName = "J.R.R.", LastName = "Tolkien"};
        var author5 = new BookAuthor { BookAuthorId = 055, FirstName = "Malcolm", LastName = "Gladwell" };
        var author6 = new BookAuthor { BookAuthorId = 066, FirstName = "Yuval Noah", LastName = "Harari" };
        var author7 = new BookAuthor { BookAuthorId = 077, FirstName = "Margaret", LastName = "Atwood" };
        var author8 = new BookAuthor { BookAuthorId = 088, FirstName = "Jane", LastName = "Austen" };
        var author9 = new BookAuthor { BookAuthorId = 099, FirstName = "Stephen", LastName = "King"};
        var author10 = new BookAuthor { BookAuthorId = 00, FirstName = "F. Scott", LastName = "Fitzgerald" };
        var author11 = new BookAuthor { BookAuthorId = 01, FirstName = "Isaac", LastName = "Asimov" };

        context.BookAuthors.AddRange(author1, author2, author3, author4, author5, author6, author7, author8, author9, author10, author11);

        // Seed Books
        var books = new List<Book>
        {
            new Book
            {
                Isbn = "978-0451524935", // 1984 by George Orwell
                Publisher = publisher1,
                BookGenre = genreFiction,
                BookAuthor = author1,
                YearPublished = 1949
            },
            new Book
            {
                Isbn = "978-0747532743", // Harry Potter and the Philosopher's Stone by J.K. Rowling
                Publisher = publisher2,
                BookGenre = genreFiction,
                BookAuthor = author2,
                YearPublished = 1997
            },
            new Book
            {
                Isbn = "978-0061120084", // To Kill a Mockingbird by Harper Lee
                Publisher = publisher3,
                BookGenre = genreFiction,
                BookAuthor = author3,
                YearPublished = 1960
            },
            new Book
            {
                Isbn = "978-0544003415", // The Hobbit by J.R.R. Tolkien
                Publisher = publisher1,
                BookGenre = genreFiction,
                BookAuthor = author4,
                YearPublished = 1937
            },
            new Book
            {
                Isbn = "978-0316017930", // Outliers by Malcolm Gladwell
                Publisher = publisher2,
                BookGenre = genreNonFiction,
                BookAuthor = author5,
                YearPublished = 2008
            },
            new Book
            {
                Isbn = "978-0062316097", // Sapiens: A Brief History of Humankind by Yuval Noah Harari
                Publisher = publisher3,
                BookGenre = genreNonFiction,
                BookAuthor = author6,
                YearPublished = 2011
            },
            new Book
            {
                Isbn = "978-0385490818", // The Handmaid's Tale by Margaret Atwood
                Publisher = publisher1,
                BookGenre = genreFiction,
                BookAuthor = author7,
                YearPublished = 1985
            },
            new Book
            {
                Isbn = "978-0141439518", // Pride and Prejudice by Jane Austen
                Publisher = publisher2,
                BookGenre = genreClassics,
                BookAuthor = author8,
                YearPublished = 1813
            },
            new Book
            {
                Isbn = "978-0451169535", // The Shining by Stephen King
                Publisher = publisher3,
                BookGenre = genreFiction,
                BookAuthor = author9,
                YearPublished = 1977
            },
            new Book
            {
                Isbn = "978-0743273565", // The Great Gatsby by F. Scott Fitzgerald
                Publisher = publisher1,
                BookGenre = genreClassics,
                BookAuthor = author10,
                YearPublished = 1925
            },
            new Book
            {
                Isbn = "978-0553382563", // Foundation by Isaac Asimov
                Publisher = publisher2,
                BookGenre = genreClassics,
                BookAuthor = author11,
                YearPublished = 1951
            }
        };

        context.Books.AddRange(books);

        // Save all the changes
        context.SaveChanges();
    }
}
