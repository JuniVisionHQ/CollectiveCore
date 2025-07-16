using CollectiveCore.Api.Data;
using CollectiveCore.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace CollectiveCore.Api.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly AppDbContext _appDbContext;
        public BookRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<IEnumerable<Book>> GetBooksAsync()
        {
            return await _appDbContext.Books.ToListAsync();
        }
        public async Task<Book?> GetBookAsync(int bookId)
        {
            return await _appDbContext.Books
                .FirstOrDefaultAsync(e => e.Id == bookId);
        }

        public async Task<Book> AddBookAsync(Book book)
        {
            var result = await _appDbContext.Books.AddAsync(book);
            await _appDbContext.SaveChangesAsync();
            return result.Entity;
        }
        public async Task<Book?> UpdateBookAsync(Book book)
        {
            var result = await _appDbContext.Books
                .FirstOrDefaultAsync(e => e.Id == book.Id);

            if (result != null)
            {
                result.Title = book.Title;
                result.Author = book.Author;
                result.Description = book.Description;
                result.Genre = book.Genre;
                result.YearPublished = book.YearPublished;
                result.BookCoverImagePath = book.BookCoverImagePath;

                await _appDbContext.SaveChangesAsync();

                return result;
            }

            return null;
        }
        public async Task<Book?> DeleteBookAsync(int bookId)
        {
            var result = await _appDbContext.Books
                .FirstOrDefaultAsync(e => e.Id == bookId);
            if (result != null)
            {
                _appDbContext.Books.Remove(result);
                await _appDbContext.SaveChangesAsync();
                return result;
            }
            return null;
        }

    }
}
