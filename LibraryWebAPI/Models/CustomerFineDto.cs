using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace LibraryWebAPI.Models;

[Keyless]
public partial class CustomerFineDto
{

    public required string Email {get; set;}
    public required string Title { get; set; }

    public required string TypeName { get; set; }

    public double Amount { get; set; }

    public DateOnly IssueDate { get; set; }

    public bool PaymentStatus { get; set; }
}
