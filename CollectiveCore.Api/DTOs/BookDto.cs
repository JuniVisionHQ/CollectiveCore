namespace CollectiveCore.Api.DTOs
{
    public class BookDto
    {
        public int Id { get; set; }                     // Safe to expose
        public string Title { get; set; }
        public string Author { get; set; }
        public string? Description { get; set; }
        public string? Genre { get; set; }
        public int? YearPublished { get; set; }
        public string? BookCoverImageUrl { get; set; }
    }
}