using System.ComponentModel.DataAnnotations;

public class CustomerReportDto
{
    
            [Key]
 public string Email { get; set; } = null!;
        public required string  FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Type { get; set; } // BorrowerType
    public DateTime MembershipStartDate { get; set; }
    public DateTime? MembershipEndDate { get; set; }
    public int BorrowingLimit { get; set; }

        public bool EmailConfirmed { get; set; }
}
