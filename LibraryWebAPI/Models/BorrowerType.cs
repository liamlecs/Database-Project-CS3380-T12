using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class BorrowerType
{
    public int BorrowerTypeId { get; set; }

    public string Type { get; set; } = null!;

    public int BorrowingLimit { get; set; }

    public int LoanPeriod { get; set; }

    public int ReservationWindow { get; set; }

    public virtual ICollection<Customer> Customers { get; set; } = new List<Customer>();
}
