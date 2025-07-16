using CollectiveCore.Api.DTOs;
using CollectiveCore.Api.Repositories;
using CollectiveCore.Models;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using System.Runtime.ConstrainedExecution;

namespace CollectiveCore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookRepository _bookRepository;
        private readonly IWebHostEnvironment _env; //used for wwwroot

        public BooksController(IBookRepository bookRepository, IWebHostEnvironment env)
        {
            _bookRepository = bookRepository;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            try
            {
                var books = await _bookRepository.GetBooksAsync();  // Get entities

                var bookDtos = books.Select(b => new BookDto     // Map entities to DTOs
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    Description = b.Description,
                    Genre = b.Genre,
                    YearPublished = b.YearPublished,
                    BookCoverImagePath = b.BookCoverImagePath
                });

                return Ok(bookDtos);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            try
            {
                var result = await _bookRepository.GetBookAsync(id);

                if (result == null) return NotFound();

                var bookDto = new BookDto
                {
                    Id = result.Id,
                    Title = result.Title,
                    Author = result.Author,
                    Description = result.Description,
                    Genre = result.Genre,
                    YearPublished = result.YearPublished,
                    BookCoverImagePath = result.BookCoverImagePath
                };

                return Ok(bookDto);

            } 
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }

        [HttpPost]
        public async Task<ActionResult<BookDto>> CreateBook([FromForm] CreateBookDto newBookDto, IFormFile? coverImageFile)
        {
            try
            {
                if (newBookDto == null)
                {
                    return BadRequest();
                }

                if (coverImageFile != null)
                {

                    var sanitizedTitle = SanitizeFileName(newBookDto.Title);

                    var uploadsFolder = Path.Combine(_env.WebRootPath, "images");
                    var uniqueFileName = $"{sanitizedTitle}_{Guid.NewGuid()}{Path.GetExtension(coverImageFile.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await coverImageFile.CopyToAsync(fileStream);
                    }

                    newBookDto.BookCoverImagePath = $"/images/{uniqueFileName}";
                }

                // Map DTO to Book entity
                var book = new Book
                {
                    Title = newBookDto.Title,
                    Author = newBookDto.Author,
                    Description = newBookDto.Description,
                    Genre = newBookDto.Genre,
                    YearPublished = newBookDto.YearPublished,
                    BookCoverImagePath = newBookDto.BookCoverImagePath
                };

                // Save to database using your repository
                await _bookRepository.AddBookAsync(book);


                // Map the saved entity back to a BookDto (with the new Id)
                var bookDto = new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Author = book.Author,
                    Description = book.Description,
                    Genre = book.Genre,
                    YearPublished = book.YearPublished,
                    BookCoverImagePath = book.BookCoverImagePath
                };

                // Return created response with DTO
                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, bookDto);                

              
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error creating new book record");
            }
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<BookDto>> UpdateBook(int id, UpdateBookDto updatedBookDto)
        {
            try
            {
                if (updatedBookDto == null)
                    return BadRequest("Invalid book data.");

                var existingBook = await _bookRepository.GetBookAsync(id);

                if (existingBook == null)
                    return NotFound($"Book with ID {id} not found.");

                // Update fields
                existingBook.Title = updatedBookDto.Title;
                existingBook.Author = updatedBookDto.Author;
                existingBook.Description = updatedBookDto.Description;
                existingBook.Genre = updatedBookDto.Genre;
                existingBook.YearPublished = updatedBookDto.YearPublished;
                existingBook.BookCoverImagePath = updatedBookDto.BookCoverImagePath;

                // Actually save and update using the repository
                var updatedBook = await _bookRepository.UpdateBookAsync(existingBook);

                // Convert to BookDto
                var bookDto = new BookDto
                {
                    Id = updatedBook.Id,
                    Title = updatedBook.Title,
                    Author = updatedBook.Author,
                    Description = updatedBook.Description,
                    Genre = updatedBook.Genre,
                    YearPublished = updatedBook.YearPublished,
                    BookCoverImagePath = updatedBook.BookCoverImagePath
                };

                return Ok(bookDto);


            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error updating data");
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Book>> DeleteBook(int id)
        {
            try
            {
                var bookToDelete = await _bookRepository.GetBookAsync(id);

                if (bookToDelete == null)
                {
                    return NotFound($"Book with Id = {id} not found");
                }

                return await _bookRepository.DeleteBookAsync(id);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error deleting data");
            }
        }

        private string SanitizeFileName(string input)
        {
            var invalidChars = Path.GetInvalidFileNameChars();
            var cleaned = new string(input.Where(ch => !invalidChars.Contains(ch)).ToArray());
            cleaned = cleaned.Replace(' ', '_');
            return cleaned.Length > 20 ? cleaned.Substring(0, 20) : cleaned;
        }

    }
}
