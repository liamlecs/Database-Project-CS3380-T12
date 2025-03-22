using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Fine
{
    public int FineId { get; set; }

    public int TransactionId { get; set; }

    public int CustomerId { get; set; }

    public double Amount { get; set; }

    public DateOnly DueDate { get; set; }

    public DateOnly IssueDate { get; set; }

    public bool PaymentStatus { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual TransactionHistory Transaction { get; set; } = null!;
}
