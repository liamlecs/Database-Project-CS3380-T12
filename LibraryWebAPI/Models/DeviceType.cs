using System; 
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.Models
{
    public partial class DeviceType
    {
        [Key]
        public int DeviceTypeID { get; set; }

        [Required]
        [MaxLength(50)]
        public string TypeName { get; set; } = null!;

        // Navigation property to Technology
        public virtual ICollection<Technology>? Technologies { get; set; }
    }
}