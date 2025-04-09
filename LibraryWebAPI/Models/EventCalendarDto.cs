using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryWebAPI.Models;

public partial class EventCalendarDto
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int EventId { get; set; }

    public DateTime StartTimestamp { get; set; }

    public DateTime? EndTimestamp { get; set; }

    public string Location { get; set; } = null!;

    public int AgeGroup { get; set; }

    public string CategoryDescription { get; set; }
    public bool IsPrivate { get; set; }

    public string Description { get; set; } = null!;

    public string Title { get; set; } = null!;




}
