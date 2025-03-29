using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Music
{
    public int MusicId { get; set; }

    public string Artist { get; set; } = null!;

    public int MusicGenreId { get; set; }

    public string Format { get; set; } = null!;

    public virtual MusicGenre MusicGenre { get; set; } = null!;

    // public virtual Item MusicNavigation { get; set; } = null!;
}
