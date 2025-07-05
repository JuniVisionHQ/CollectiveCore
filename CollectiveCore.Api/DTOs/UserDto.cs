namespace CollectiveCore.Api.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }               // Safe to expose
        public string UserName { get; set; }      // Safe
        public string Email { get; set; }         // Optional: only expose if needed
    }
}
