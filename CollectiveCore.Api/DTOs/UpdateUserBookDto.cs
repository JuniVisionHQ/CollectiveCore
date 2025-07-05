using System.ComponentModel.DataAnnotations;

namespace CollectiveCore.Api.DTOs
{
    public class UpdateUserBookDto
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public int BookId { get; set; }

        // These are optional updates — client may choose to update one, both, or neither
        public bool? IsFavorite { get; set; }
        public bool? HasRead { get; set; }
    }
}
