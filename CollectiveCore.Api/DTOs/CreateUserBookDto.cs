using System.ComponentModel.DataAnnotations;

namespace CollectiveCore.Api.DTOs
{
    public class CreateUserBookDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int BookId { get; set; }

        public bool IsFavorite { get; set; } = false;

        public bool HasRead { get; set; } = false;
    }
}
