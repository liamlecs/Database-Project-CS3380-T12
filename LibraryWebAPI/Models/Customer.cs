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

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public int BorrowerTypeId { get; set; }

        public DateOnly MembershipStartDate { get; set; }

        public DateOnly? MembershipEndDate { get; set; }

        public string AccountPassword { get; set; } = null!;

        public DateTime? CreatedAt { get; set; }
    }
}
