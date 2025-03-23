using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class EventCategory
{
    public int CategoryId { get; set; }

    public string CategoryDescription { get; set; } = null!;

}
