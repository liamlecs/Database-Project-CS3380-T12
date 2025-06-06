﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models;

public partial class Waitlist
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int WaitlistId { get; set; }
    
    public int CustomerId { get; set; }

    public int ItemId { get; set; }

    public DateTime ReservationDate { get; set; }

    public bool isReceived { get; set; }


    // Navigation property for the related Item
    [ForeignKey("ItemId")]
    public virtual Item? Item { get; set; }

}

public class WaitlistReport
{
    public int WaitlistId { get; set; }
    public int CustomerId { get; set; }
    public int ItemId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string ItemType { get; set; } = null!;
    public string Title { get; set; } = null!;
    public DateTime ReservationDate { get; set; }
    public bool IsReceived { get; set; }
}

