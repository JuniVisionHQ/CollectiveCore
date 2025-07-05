namespace CollectiveCore.Api.DTOs
{
    public class UserBookDto
    {
        public int UserId { get; set; }
        public int BookId { get; set; }

        public string Title { get; set; }         // From Book
        public string Author { get; set; }        // From Book

        public bool IsFavorite { get; set; }
        public bool HasRead { get; set; }
    }
}
