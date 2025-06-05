using System.ComponentModel.DataAnnotations;

namespace CollectiveCore.Models
{
    public class Book
    {
        public int Id { get; set; }                     // Primary key
        [Required]
        public string Title { get; set; }
        [Required]
        public string Author { get; set; } 
        public string? Description { get; set; }        // Optional
        public string? Genre { get; set; }              // Optional
        public int? YearPublished { get; set; }         // Optional

        public string? BookCoverImageUrl { get; set; }  // Optional

        public List<UserBook>? UserBooks { get; set; } = new();

    }
}
