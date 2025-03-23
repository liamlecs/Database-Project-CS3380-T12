using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models;

public partial class Donation
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] //must insert key and dbgen
    public int DonationId { get; set; }

    public int CustomerId { get; set; }

    public double Amount { get; set; }

    public DateOnly Date { get; set; }

}
