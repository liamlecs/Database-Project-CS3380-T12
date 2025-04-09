using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // <-- Add this
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models
{
    public partial class TransactionFineDto
    {
    
        public string Title { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Type { get; set; }

        public DateOnly DateBorrowed { get; set; }
        public DateOnly DueDate { get; set; }

        public DateOnly IssueDate { get; set; }

        public double Amount { get; set; }

        public string ItemType { get; set; }

        public bool PaymentStatus { get; set; }
    }
}
