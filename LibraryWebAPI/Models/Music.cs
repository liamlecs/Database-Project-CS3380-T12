using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Music
{
    public int SongId { get; set; }

    public int MusicArtistId { get; set; }

    public int MusicGenreId { get; set; }

    public string? Format { get; set; }

    public string? CoverImagePath { get; set; }

    public int ItemId { get; set; }

    public virtual MusicArtist MusicArtist { get; set; } = null!;

    public virtual MusicGenre MusicGenre { get; set; } = null!;

    public virtual Item Item { get; set; } = null!;
}
