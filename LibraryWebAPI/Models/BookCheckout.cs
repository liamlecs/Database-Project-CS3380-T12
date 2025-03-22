using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;
{
    public class BookCheckout
    {
        public int BookId { get; set; }
        public int CustomerId { get; set; }
        public DateTime CheckoutDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public bool IsReturned { get; set; }
    }
}
