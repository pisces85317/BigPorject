using System;
using System.Collections.Generic;

namespace BigPorject.Models;

public partial class Cartheater
{
    public string CartId { get; set; } = null!;

    public string? UserId { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? Status { get; set; }
}
