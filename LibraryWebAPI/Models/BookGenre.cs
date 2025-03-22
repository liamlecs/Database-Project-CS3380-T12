using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class BookGenre
{
    public int BookGenreId { get; set; }

    public string Description { get; set; } = null!;

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
