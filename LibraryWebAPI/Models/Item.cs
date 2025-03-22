using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Item
{
    public int ItemId { get; set; }

    public string Title { get; set; } = null!;

    public string AvailabilityStatus { get; set; } = null!;

    public int TotalCopies { get; set; }

    public int AvailableCopies { get; set; }

    public string? Location { get; set; }

    public virtual Book? Book { get; set; }

    public virtual Movie? Movie { get; set; }

    public virtual Music? Music { get; set; }

    public virtual Technology? Technology { get; set; }

    public virtual ICollection<TransactionHistory> TransactionHistories { get; set; } = new List<TransactionHistory>();

    public virtual ICollection<Waitlist> Waitlists { get; set; } = new List<Waitlist>();
}
