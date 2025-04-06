using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.Models;

public partial class Item
{
            [Key]
    public int ItemId { get; set; }

    public string Title { get; set; } = null!;

    public string AvailabilityStatus { get; set; } = null!;

    public int TotalCopies { get; set; }

    public int AvailableCopies { get; set; }

    public string? Location { get; set; }
    
}
