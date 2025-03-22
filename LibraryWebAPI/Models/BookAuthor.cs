using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class BookAuthor
{
    public int BookAuthorId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
