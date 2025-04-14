using Microsoft.AspNetCore.Http;

namespace LibraryWebAPI.Models.DTOs
{
    public class CoverUploadDto
    {
        public required IFormFile Cover { get; set; }
    }
}
