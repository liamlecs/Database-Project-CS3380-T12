using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // <-- Add this
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models
{
    public partial class TransactionPopularityDto
    {

    public string Title { get; set; }
    public int Count { get; set; }

    public string ItemType { get; set; }
    }
}
