using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Book
{
    public int BookId { get; set; }

    public string? Isbn { get; set; } // nullable

    public int PublisherId { get; set; }

    public int BookGenreId { get; set; }

    public int BookAuthorId { get; set; }

    public int YearPublished { get; set; }

    public int ItemID { get; set; }

    public string? CoverImagePath {get; set;} 


    public virtual Item Item { get; set; } = null!; // to view the item name (book title)

    public virtual BookAuthor BookAuthor { get; set; } = null!; // to view the author name

    public virtual BookGenre BookGenre { get; set; } = null!; // to view the genre name

    // public virtual Item BookNavigation { get; set; } = null!;

    public virtual Publisher Publisher { get; set; } = null!; // to view the publisher name

    // public bool IsCheckedOut { get; set; } // Added property
}

