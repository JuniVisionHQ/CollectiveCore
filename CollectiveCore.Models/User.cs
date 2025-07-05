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

        // Navigation property - list of books the user owns
        public List<UserBook> UserBooks { get; set; } = new();

    }
}
