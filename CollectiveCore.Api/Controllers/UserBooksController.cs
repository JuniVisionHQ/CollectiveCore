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

        public UserBooksController(IUserBookRepository userBookRepository)
        {
            _userBookRepository = userBookRepository;
        }

        [HttpGet("{userId:int}/{bookId:int}")]
        public async Task<ActionResult<UserBookDto>> GetUserBook(int userId, int bookId)
        {
            var userBook = await _userBookRepository.GetUserBookRelationshipAsync(userId, bookId);

            if (userBook == null)
                return NotFound("User-book relationship not found.");

            // Defensive: Check if navigation properties are loaded
            var book = userBook.Book;
            if (book == null)
            {
                return NotFound("Book info not found for this user-book relationship.");
            }

            // Map to DTO
            var dto = new UserBookDto
            {
                UserId = userBook.UserId,
                BookId = userBook.BookId,
                Title = userBook.Book.Title,
                Author = userBook.Book.Author,
                IsFavorite = userBook.IsFavorite,
                HasRead = userBook.HasRead
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> AddUserBook(CreateUserBookDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid request.");

            // Check if this relationship already exists
            var exists = await _userBookRepository.ExistsAsync(dto.UserId, dto.BookId);
            if (exists)
                return Conflict("This book is already in the user's collection.");

            var userBook = new UserBook
            {
                UserId = dto.UserId,
                BookId = dto.BookId,
                IsFavorite = dto.IsFavorite,
                HasRead = dto.HasRead
            };

            await _userBookRepository.AddUserBookAsync(userBook);

            return CreatedAtAction(nameof(GetUserBook), new { userId = dto.UserId, bookId = dto.BookId }, null);
        }
    }
}
