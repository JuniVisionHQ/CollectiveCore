using CollectiveCore.Api.DTOs;
using CollectiveCore.Api.Repositories;
using CollectiveCore.Models;
using Microsoft.AspNetCore.Mvc;

namespace CollectiveCore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserBooksController : ControllerBase
    {
        private readonly IUserBookRepository _userBookRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IUserRepository _userRepository;

        public UserBooksController(
            IUserBookRepository userBookRepository,
            IBookRepository bookRepository,
            IUserRepository userRepository)
        {
            _userBookRepository = userBookRepository;
            _bookRepository = bookRepository;
            _userRepository = userRepository;
        }

        [HttpGet("{userId:int}/{bookId:int}")]
        public async Task<ActionResult<UserBookDto>> GetUserBook(int userId, int bookId)
        {
            var userBook = await _userBookRepository.GetUserBookRelationshipAsync(userId, bookId);

            if (userBook == null)
                return NotFound("User-book relationship not found.");

            if (userBook.Book == null)
            {
                // This shouldn't happen
                return NotFound("Book info not found for this user-book relationship.");
            }

            // Map to DTO
            var userBookDto = new UserBookDto
            {
                UserId = userBook.UserId,
                BookId = userBook.BookId,
                Title = userBook.Book.Title,
                Author = userBook.Book.Author,
                IsFavorite = userBook.IsFavorite,
                HasRead = userBook.HasRead
            };

            return Ok(userBookDto);
        }

        [HttpPost]
        public async Task<IActionResult> AddUserBook(CreateUserBookDto createDto)
        {
            if (createDto == null)
            {
                return BadRequest("Request body is missing.");
            }

            // Optional: check if relationship already exists
            var exists = await _userBookRepository.ExistsAsync(createDto.UserId, createDto.BookId);
            if (exists)
            {
                return Conflict("User already has this book.");
            }

            // Optional: validate user and book IDs exist (requires IUserRepository and IBookRepository)
            var user = await _userRepository.GetUserAsync(createDto.UserId);
            if (user == null)
            {
                return NotFound($"User with ID {createDto.UserId} not found.");
            }
            var book = await _bookRepository.GetBookAsync(createDto.BookId);
            if (book == null)
            {
                return NotFound($"Book with ID {createDto.BookId} not found.");
            }

            var userBook = new UserBook
            {
                UserId = createDto.UserId,
                BookId = createDto.BookId,
                IsFavorite = createDto.IsFavorite,
                HasRead = createDto.HasRead
            };

            await _userBookRepository.AddUserBookAsync(userBook);

            var userBookDto = new UserBookDto
            {
                UserId = userBook.UserId,
                BookId = userBook.BookId,
                Title = book.Title,
                Author = book.Author,
                IsFavorite = userBook.IsFavorite,
                HasRead = userBook.HasRead
            };

            return CreatedAtAction(nameof(GetUserBook), new { userId = userBook.UserId, bookId = userBook.BookId }, userBookDto);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUserBook(UpdateUserBookDto updateDto)
        {
            if (updateDto == null)
                return BadRequest("Invalid update request.");

            var userBook = await _userBookRepository.GetUserBookRelationshipAsync(updateDto.UserId, updateDto.BookId);
            if (userBook == null)
                return NotFound("User-book relationship not found.");

            // Only update the flags if values are provided
            if (updateDto.IsFavorite.HasValue)
                userBook.IsFavorite = updateDto.IsFavorite.Value;

            if (updateDto.HasRead.HasValue)
                userBook.HasRead = updateDto.HasRead.Value;

            await _userBookRepository.UpdateUserBookAsync(userBook);

            // Build DTO to return
            var updatedDto = new UserBookDto
            {
                UserId = userBook.UserId,
                BookId = userBook.BookId,
                Title = userBook.Book?.Title ?? "(Unknown)",
                Author = userBook.Book?.Author ?? "(Unknown)",
                IsFavorite = userBook.IsFavorite,
                HasRead = userBook.HasRead
            };

            return Ok(updatedDto);
        }

        [HttpDelete("{userId:int}/{bookId:int}")]
        public async Task<IActionResult> DeleteUserBook(int userId, int bookId)
        {
            // First, check if the user-book relationship exists
            var userBook = await _userBookRepository.GetUserBookRelationshipAsync(userId, bookId);
            if (userBook == null)
            {
                return NotFound("User-book relationship not found.");
            }

            // Remove the relationship
            await _userBookRepository.RemoveUserBookAsync(userBook);

            // Return NoContent to indicate success but no body needed
            return NoContent();
        }


        [HttpGet("user/{userId:int}")]
        public async Task<ActionResult<IEnumerable<UserBookDto>>> GetBooksByUser(int userId)
        {
            var userBooks = await _userBookRepository.GetBooksByUserAsync(userId);

            if (userBooks == null || !userBooks.Any())
            {
                return NotFound($"No books found for user with ID {userId}.");
            }

            // Map each UserBook to a DTO
            var userBookDtos = userBooks.Select(ub => new UserBookDto
            {
                UserId = ub.UserId,
                BookId = ub.BookId,
                Title = ub.Book?.Title ?? "(Unknown)",
                Author = ub.Book?.Author ?? "(Unknown)",
                IsFavorite = ub.IsFavorite,
                HasRead = ub.HasRead
            });

            return Ok(userBookDtos);
        }

    }
}
