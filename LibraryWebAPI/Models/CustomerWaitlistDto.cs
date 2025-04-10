using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace LibraryWebAPI.Models;

[Keyless]
public partial class CustomerWaitlistDto
{

    public string Email {get; set;}
    public string Title { get; set; }

    public string TypeName { get; set; }

    public DateTime ReservationDate { get; set; }

    public int WaitlistPosition { get; set; }
}
