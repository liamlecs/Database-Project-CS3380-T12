using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace LibraryWebAPI.Models;

public partial class Technology
{
    // public int ItemId { get; set; } // fk to the Item table
        [Key]
    public int DeviceId { get; set; }

    // fk for DeviceType
    public int DeviceTypeID { get; set; }
    public virtual DeviceType? DeviceType { get; set; }

    // fk for TechnologyManufacturer
    public int ManufacturerID { get; set; }
    public virtual TechnologyManufacturer? Manufacturer { get; set; }

    // fk for Item table
    // Foreign key for Item table
    [ForeignKey("Item")]
    [Column("ItemID")]
    public int ItemID { get; set; }

    public virtual Item? Item { get; set; }

    public string ModelNumber { get; set; } = null!;

    // Optional image path for consistency
    public string? CoverImagePath { get; set; }
}