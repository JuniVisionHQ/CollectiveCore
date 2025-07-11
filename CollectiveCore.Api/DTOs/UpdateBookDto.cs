﻿using System.ComponentModel.DataAnnotations;

namespace CollectiveCore.Api.DTOs
{
    public class UpdateBookDto
    {
        [StringLength(150, MinimumLength = 2, ErrorMessage = "Title must be between 2 and 150 characters.")]
        public string? Title { get; set; }

        [StringLength(100, MinimumLength = 2, ErrorMessage = "Author must be between 2 and 100 characters.")]
        public string? Author { get; set; }

        [StringLength(1000, ErrorMessage = "Description can't be longer than 1000 characters.")]
        public string? Description { get; set; }

        [StringLength(50, ErrorMessage = "Genre can't be longer than 50 characters.")]
        public string? Genre { get; set; }

        [Range(1, 2100, ErrorMessage = "Year must be between 1 and 2100.")]
        public int? YearPublished { get; set; }

        [Url(ErrorMessage = "Book cover image must be a valid URL.")]
        public string? BookCoverImageUrl { get; set; }
    }
}