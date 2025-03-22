using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Event
{
    public int EventId { get; set; }

    public DateTime StartTimestamp { get; set; }

    public DateTime? EndTimestamp { get; set; }

    public string Location { get; set; } = null!;

    public byte[]? AgeGroup { get; set; }

    public int CategoryId { get; set; }

    public bool IsPrivate { get; set; }

    public virtual EventCategory Category { get; set; } = null!;
}
