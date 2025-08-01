using System.ComponentModel.DataAnnotations;

namespace CollectiveCore.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]// Primary key
        public string UserName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string? Auth0UserId { get; set; } // Optional, for Auth0 integration

        // Navigation property - list of books the user owns
        public List<UserBook> UserBooks { get; set; } = new();

    }
}
