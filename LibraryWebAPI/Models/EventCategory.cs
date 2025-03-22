using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class EventCategory
{
    public int CategoryId { get; set; }

    public string CategoryDescription { get; set; } = null!;

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}
