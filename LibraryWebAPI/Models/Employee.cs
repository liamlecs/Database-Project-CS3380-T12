using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models
{
[Table("Employee")] // use exact table name from your database
public class Employee
{
    public int EmployeeID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }
    public int Sex { get; set; }
    public int SupervisorID { get; set; }
    public string Username { get; set; }
    public string AccountPassword { get; set; }
    public DateTime? CreatedAt { get; set; }
}

}
