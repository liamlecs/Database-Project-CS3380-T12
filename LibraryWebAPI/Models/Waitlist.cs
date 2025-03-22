using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Waitlist
{
    public int WaitlistId { get; set; }

    public int CustomerId { get; set; }

    public int ItemId { get; set; }

    public DateOnly ReservationDate { get; set; }

    public string Status { get; set; } = null!;

    public virtual Customer Customer { get; set; } = null!;

    public virtual Item Item { get; set; } = null!;
}
