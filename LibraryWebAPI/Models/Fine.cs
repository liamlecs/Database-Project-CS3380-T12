using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models;

public partial class Fine
{
        [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int FineId { get; set; }

    public int TransactionId { get; set; }

    public int CustomerId { get; set; }

    public double Amount { get; set; }

    public DateOnly DueDate { get; set; }

    public DateOnly IssueDate { get; set; }

    public bool PaymentStatus { get; set; }
}
