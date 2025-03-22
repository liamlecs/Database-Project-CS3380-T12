using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models
{
[Table("Customer")] // <-- exact name of your table in Azure SQL
public class Customer
{
    public int CustomerID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public int BorrowerTypeID { get; set; }
    public DateTime MembershipStartDate { get; set; }
    public DateTime MembershipEndDate { get; set; }
    public string AccountPassword { get; set; }
    public DateTime? CreatedAt { get; set; }
}

}
