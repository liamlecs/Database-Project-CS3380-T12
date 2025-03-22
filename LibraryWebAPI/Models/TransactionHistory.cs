using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // <-- Add this
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models
{
    public partial class TransactionHistory
    {
        [Key] // <-- Add this line
        public int TransactionId { get; set; }

        public int CustomerId { get; set; }

        public int ItemId { get; set; }

        public DateOnly DateBorrowed { get; set; }

        public DateOnly DueDate { get; set; }

        public DateOnly? ReturnDate { get; set; }

        public virtual Customer Customer { get; set; } = null!;

        public virtual ICollection<Fine> Fines { get; set; } = new List<Fine>();

        public virtual Item Item { get; set; } = null!;
    }
}
