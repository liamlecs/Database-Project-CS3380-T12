using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace LibraryWebAPI.Models;

[Keyless]
public partial class FineSummaryDto
{

    public string? MostFinedCustomerEmail { get; set; }

    public int? NumberOfFines { get; set; }

    public double? MaxUnpaidFineAmount { get; set; }
    public string? AssociatedItemTitle { get; set; }
    public string? AssociatedItemType { get; set; }
    public string? MaxFineCustomerEmail { get; set; }

    public double? AvgDaysLate { get; set; }

    
}
