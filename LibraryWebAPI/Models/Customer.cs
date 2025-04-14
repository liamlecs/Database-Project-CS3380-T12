using System.ComponentModel.DataAnnotations.Schema; // ✅ Add this using statement
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.Models
{
    [Table("Customer")] // ✅ Tells EF to use the correct table name
    public partial class Customer
    {
        [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CustomerId { get; set; }

        public bool IsActive { get; set; } = true;

        // You can use this field to store the code that is sent out for reactivation.
        public string? ReactivationCode { get; set; }

        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetPasswordTokenExpiration { get; set; }

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public int BorrowerTypeId { get; set; }

        public DateOnly MembershipStartDate { get; set; }

        public DateOnly? MembershipEndDate { get; set; }

        public string AccountPassword { get; set; } = null!;

        public DateTime? CreatedAt { get; set; }

        public virtual BorrowerType BorrowerType { get; set; } = null!;

        public string? EmailConfirmationCode { get; set; }
        public bool EmailConfirmed { get; set; } = false;

        public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();

        public virtual ICollection<Fine> Fines { get; set; } = new List<Fine>();

        public virtual ICollection<TransactionHistory> TransactionHistories { get; set; } = new List<TransactionHistory>();

        public virtual ICollection<Waitlist> Waitlists { get; set; } = new List<Waitlist>();
    }
}
