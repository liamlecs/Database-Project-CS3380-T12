using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // <-- Add this
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models
{
    public partial class TransactionHistoryDto
    {
        public int TransactionId { get; set; }
        public int CustomerId { get; set; }
        public int ItemId { get; set; }
        public string? Title { get; set; } // Include Title from Item table
        public DateTime DateBorrowed { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
    }


}

