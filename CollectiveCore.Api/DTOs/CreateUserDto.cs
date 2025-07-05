using System.ComponentModel.DataAnnotations;

namespace CollectiveCore.Api.DTOs
{
    public class CreateUserDto
    {
        [Required(ErrorMessage = "UserName is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "UserName must be between 2 and 100 characters.")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [StringLength(254, ErrorMessage = "Email can't be longer than 254 characters.")]
        public string Email { get; set; }
    }
}