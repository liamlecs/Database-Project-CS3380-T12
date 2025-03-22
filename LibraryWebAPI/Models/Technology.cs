using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace LibraryWebAPI.Models;

public partial class Technology
{
    [Key]
    public int DeviceId { get; set; }

    public string DeviceType { get; set; } = null!;

    public string Manufacturer { get; set; } = null!;

    public string ModelNumber { get; set; } = null!;

    public virtual Item Device { get; set; } = null!;
}
