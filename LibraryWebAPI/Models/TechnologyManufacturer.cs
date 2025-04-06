using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.Models
{
    public partial class TechnologyManufacturer
    {
        [Key]
        public int ManufacturerID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = null!;

        // Navigation property (optional but useful)
        public virtual ICollection<Technology>? Technologies { get; set; }
    }
}