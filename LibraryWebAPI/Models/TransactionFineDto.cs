using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // <-- Add this
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models
{
    public partial class TransactionFineDto
    {
    
        public required string Title { get; set; }

        public required string Email { get; set; }

        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        public required string Type { get; set; }

        public DateOnly DateBorrowed { get; set; }
        public DateOnly DueDate { get; set; }

        public DateOnly IssueDate { get; set; }

        public double Amount { get; set; }

        public required string ItemType { get; set; }

        public bool PaymentStatus { get; set; }
    }
}
