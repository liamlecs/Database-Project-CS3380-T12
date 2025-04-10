using System;
using System.Collections.Generic;
namespace LibraryWebAPI.DTOs
{
    public class UpdateAvailableCopiesDto
    {
        public int ItemId { get; set; }
        public int ChangeInCopies { get; set; } // e.g. -1 to subtract, +1 to return
    }
}
