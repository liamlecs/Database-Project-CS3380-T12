using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Book
{
    public int BookId { get; set; }

    public string Isbn { get; set; } = null!;

    public int PublisherId { get; set; }

    public int BookGenreId { get; set; }

    public int BookAuthorId { get; set; }

    public int YearPublished { get; set; }

    public virtual BookAuthor BookAuthor { get; set; } = null!;

    public virtual BookGenre BookGenre { get; set; } = null!;

    public virtual Item BookNavigation { get; set; } = null!;

    public virtual Publisher Publisher { get; set; } = null!;
}
