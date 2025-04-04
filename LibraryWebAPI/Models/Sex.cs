﻿using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Sex
{
    public int SexID { get; set; }

    public string Description { get; set; } = null!;

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
