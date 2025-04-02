using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models;

public class Donation
{
    [Key]
    public int DonationId { get; set; }

    public int? CustomerId { get; set; } // donors don't require an account

    [Required]
    [Range(0.00, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
    public double Amount { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    public string? FirstName { get; set; }
    public string? LastName { get; set; } 

    // Navigation property
    [ForeignKey("CustomerId")]
    public virtual Customer? Customer {get; set;}
    
}