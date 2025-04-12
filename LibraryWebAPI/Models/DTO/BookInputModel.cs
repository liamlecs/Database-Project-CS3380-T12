using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models.DTO
{
    public class BookInputModel
    {
        public string? Title { get; set; }
        public string? ISBN { get; set; }
        public int PublisherID { get; set; }
        public int BookGenreID { get; set; }
        public int BookAuthorID { get; set; }
        public int YearPublished { get; set; }
        public string? CoverImagePath { get; set; }
        public int TotalCopies { get; set; } // // these attributes are for the Item table TotalCopies and Location 
        public string? Location { get; set; }

    }
}

