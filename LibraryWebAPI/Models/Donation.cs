using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models;

public class Donation
{
    [Key]
    public int DonationId { get; set; }

    [Required]
    public int CustomerId { get; set; } // FK to Customer

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
    public double Amount { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    // navigation property for Customer
    public virtual Customer Customer { get; set; } = null!;
}
