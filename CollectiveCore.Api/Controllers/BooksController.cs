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

        public BooksController(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            try
            {
                var books = await _bookRepository.GetBooks();  // Get entities

                var bookDtos = books.Select(b => new BookDto     // Map entities to DTOs
                {
                    Id = b.Id,
                    Title = b.Title,
                    Author = b.Author,
                    Description = b.Description,
                    Genre = b.Genre,
                    YearPublished = b.YearPublished,
                    BookCoverImageUrl = b.BookCoverImageUrl
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
                var result = await _bookRepository.GetBook(id);

                if (result == null) return NotFound();

                var bookDto = new BookDto
                {
                    Id = result.Id,
                    Title = result.Title,
                    Author = result.Author,
                    Description = result.Description,
                    Genre = result.Genre,
                    YearPublished = result.YearPublished,
                    BookCoverImageUrl = result.BookCoverImageUrl
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
        public async Task<ActionResult<BookDto>> CreateBook(CreateBookDto newBookDto)
        {
            try
            {
                if (newBookDto == null)
                {
                    return BadRequest();
                }

                // Map DTO to Book entity
                var book = new Book
                {
                    Title = newBookDto.Title,
                    Author = newBookDto.Author,
                    Description = newBookDto.Description,
                    Genre = newBookDto.Genre,
                    YearPublished = newBookDto.YearPublished,
                    BookCoverImageUrl = newBookDto.BookCoverImageUrl
                };

                // Save to database using your repository
                await _bookRepository.AddBook(book);


                // Map the saved entity back to a BookDto (with the new Id)
                var bookDto = new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Author = book.Author,
                    Description = book.Description,
                    Genre = book.Genre,
                    YearPublished = book.YearPublished,
                    BookCoverImageUrl = book.BookCoverImageUrl
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

                var existingBook = await _bookRepository.GetBook(id);

                if (existingBook == null)
                    return NotFound($"Book with ID {id} not found.");

                // Update fields
                existingBook.Title = updatedBookDto.Title;
                existingBook.Author = updatedBookDto.Author;
                existingBook.Description = updatedBookDto.Description;
                existingBook.Genre = updatedBookDto.Genre;
                existingBook.YearPublished = updatedBookDto.YearPublished;
                existingBook.BookCoverImageUrl = updatedBookDto.BookCoverImageUrl;

                // Actually save and update using the repository
                var updatedBook = await _bookRepository.UpdateBook(existingBook);

                // Convert to BookDto
                var bookDto = new BookDto
                {
                    Id = updatedBook.Id,
                    Title = updatedBook.Title,
                    Author = updatedBook.Author,
                    Description = updatedBook.Description,
                    Genre = updatedBook.Genre,
                    YearPublished = updatedBook.YearPublished,
                    BookCoverImageUrl = updatedBook.BookCoverImageUrl
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
                var bookToDelete = await _bookRepository.GetBook(id);

                if (bookToDelete == null)
                {
                    return NotFound($"Book with Id = {id} not found");
                }

                return await _bookRepository.DeleteBook(id);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error deleting data");
            }
        }

    }
}
