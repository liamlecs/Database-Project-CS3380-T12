using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public string Director { get; set; } = null!;

    public int MovieGenreId { get; set; }

    public int? YearReleased { get; set; }

    public string? Format { get; set; }

    public virtual MovieGenre MovieGenre { get; set; } = null!;

    public virtual Item MovieNavigation { get; set; } = null!;
}
