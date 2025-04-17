namespace LibraryWebAPI.Models
{
    public class TechnologyDto
    {
        // Fields for the Item record:
        public string Title { get; set; } = string.Empty;

        public int ItemID { get; set; } 

        public int DeviceId { get; set; }
        public int TotalCopies { get; set; }
        public int availableCopies { get; set; } // Can choose to auto-set this on insert or allow manual input.
        public string? Location { get; set; }  // e.g., "Shelf T1"

        // Fields for the Technology record:
        public int DeviceTypeID { get; set; }  // Foreign key reference to a DeviceType table.

        public string DeviceTypeName { get; set; } = string.Empty; // Add this property
        public int ManufacturerID { get; set; }  // Foreign key reference to a Manufacturer table.

        public string ManufacturerName { get; set; } = string.Empty;
        public string ModelNumber { get; set; } = string.Empty;
        public string? CoverImagePath { get; set; }  // Should store the URL from Azure Blob Storage.
        
        // Item type for Technology;
        public int ItemTypeID { get; set; } = 4;
    }
}
