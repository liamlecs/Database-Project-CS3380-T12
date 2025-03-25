using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Employee
{
    public int EmployeeId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateOnly? BirthDate { get; set; }

    public int Sex { get; set; }

    public int? SupervisorId { get; set; }

    public string? Username { get; set; }

    public string? AccountPassword { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Sex SexNavigation { get; set; } = null!;

    public virtual Employee? Supervisor { get; set; }
}
