using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // <-- Add this
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models
{
    public partial class TransactionPopularityDto
    {

    public required string Title { get; set; }
    public int Count { get; set; }

    public required string ItemType { get; set; }
    }
}
