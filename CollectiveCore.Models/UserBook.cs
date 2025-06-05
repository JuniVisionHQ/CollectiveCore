namespace CollectiveCore.Models
{
    public class UserBook
    {
        // Composite key part 1
        public int UserId { get; set; }
        public User User { get; set; }  // Navigation to User

        // Composite key part 2
        public int BookId { get; set; }
        public Book Book { get; set; }  // Navigation to Book

        // Optional extra fields for metadata about this user's copy of the book
        public bool IsFavorite { get; set; } = false;
        public bool HasRead { get; set; } = false;
    }
}
