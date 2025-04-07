using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace LibraryWebAPI.Models

{
public class TechnologyDTO
    {
        public int ItemID { get; set; } // fk to the Item table
        public int DeviceId { get; set; }
        public string DeviceTypeName { get; set; } = string.Empty;
        
        public string Title { get; set; } = string.Empty;
        public string ManufacturerName { get; set; } = string.Empty;
        public string ModelNumber { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
    }

}