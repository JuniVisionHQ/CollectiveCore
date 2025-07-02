using System.ComponentModel.DataAnnotations;

namespace CollectiveCore.Models
{
    public class User
    {
        public int Id { get; set; }            // Primary key
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string UserName { get; set; }
        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; }

        // Navigation property - list of books the user owns
        public List<UserBook> UserBooks { get; set; } = new();

    }
}
