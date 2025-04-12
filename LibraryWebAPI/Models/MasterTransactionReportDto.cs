using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // <-- Add this
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace LibraryWebAPI.Models
{
    public class MasterTransactionReportDto
    {

        public DateTime Timestamp { get; set; }

        public double? OutstandingFines { get; set; }

        public int? RegisteredUsers { get; set; }

        public int? RegisteredUsersThatJoined { get; set; }

        public int? BookTitleCount { get; set; }
        public int? TotalBookCount { get; set; }

        public int? AvailableBookCount { get; set; }

        public int? MovieTitleCount { get; set; }
        public int? TotalMovieCount { get; set; }

        public int? AvailableMovieCount { get; set; }

        public int? MusicTitleCount { get; set; }
        public int? TotalMusicCount { get; set; }

        public int? AvailableMusicCount { get; set; }

        public int? TechTitleCount { get; set; }
        public int? TotalTechCount { get; set; }

        public int? AvailableTechCount { get; set; }

        public int? TotalTitleCount { get; set; }

        public int? TotalAvailableCount { get; set; }

        public int? TotalCopiesCount { get; set; }

public int? CheckoutInstances { get; set; }

public int? UniqueCustomers { get; set; }

[NotMapped]
        public List<TransactionPopularityDto> TransactionPopularity { get; set; }

[NotMapped]
        public List<TransactionFineDto> TransactionFine { get; set; }

    }
}
