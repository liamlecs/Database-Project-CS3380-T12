using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Donation
{
    public int DonationId { get; set; }

    public int CustomerId { get; set; }

    public double Amount { get; set; }

    public DateOnly Date { get; set; }

    public virtual Customer Customer { get; set; } = null!;
}
