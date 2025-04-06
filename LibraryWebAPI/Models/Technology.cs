using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace LibraryWebAPI.Models;

public partial class Technology
{
        [Key]
    public int DeviceId { get; set; }

    // Foreign key for DeviceType
    public int DeviceTypeID { get; set; }
    public virtual DeviceType? DeviceType { get; set; }

    // Foreign key for Manufacturer
    public int ManufacturerID { get; set; }
    public virtual TechnologyManufacturer? Manufacturer { get; set; }

    // Foreign key to the Item table
    public int ItemID { get; set; }
    public virtual Item? Item { get; set; }

    public string ModelNumber { get; set; } = null!;

    // Optional image path for consistency
    public string? CoverImagePath { get; set; }
}
