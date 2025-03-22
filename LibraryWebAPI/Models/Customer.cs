using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int BorrowerTypeId { get; set; }

    public DateOnly MembershipStartDate { get; set; }

    public DateOnly? MembershipEndDate { get; set; }

    public string AccountPassword { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual BorrowerType BorrowerType { get; set; } = null!;

    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();

    public virtual ICollection<Fine> Fines { get; set; } = new List<Fine>();

    public virtual ICollection<TransactionHistory> TransactionHistories { get; set; } = new List<TransactionHistory>();

    public virtual ICollection<Waitlist> Waitlists { get; set; } = new List<Waitlist>();
}
