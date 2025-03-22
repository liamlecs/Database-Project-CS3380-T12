using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class MovieGenre
{
    public int MovieGenreId { get; set; }

    public string Description { get; set; } = null!;

    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
