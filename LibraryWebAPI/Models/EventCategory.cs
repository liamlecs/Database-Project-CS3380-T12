using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.Models;

public partial class EventCategory
{
        [Key]
    public int CategoryId { get; set; }

    public string CategoryDescription { get; set; } = null!;

}
