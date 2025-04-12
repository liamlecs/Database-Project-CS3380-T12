using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace LibraryWebAPI.Models;

[Keyless]
public partial class CustomerWaitlistDto
{

    public required string Email {get; set;}
    public required string Title { get; set; }

    public required string TypeName { get; set; }

    public DateTime ReservationDate { get; set; }

    public int WaitlistPosition { get; set; }
}
