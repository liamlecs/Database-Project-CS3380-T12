using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace LibraryWebAPI.Models;

[Keyless]
public partial class CustomerTransactionDto
{

    public required string Email {get; set;}
    
    public required string Title { get; set; }

    public required string TypeName { get; set; }

    public DateOnly DateBorrowed { get; set; }

    public DateOnly DueDate { get; set; }

    public DateOnly ReturnDate { get; set; }

}
