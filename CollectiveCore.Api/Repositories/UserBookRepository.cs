using CollectiveCore.Api.Data;
using CollectiveCore.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace CollectiveCore.Api.Repositories
{
    public class UserBookRepository : IUserBookRepository
    {
        private readonly AppDbContext _appDbContext;

        public UserBookRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<UserBook?> GetUserBookRelationshipAsync(int userId, int bookId)
        {
            return await _appDbContext.UserBooks
                 .Include(ub => ub.Book)  // Include related Book entity
                .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId);
        }

        public async Task<IEnumerable<UserBook>> GetBooksByUserAsync(int userId)
        {
            return await _appDbContext.UserBooks
                .Include(ub => ub.Book)
                .Where(ub => ub.UserId == userId)
                .ToListAsync();
        }
        public async Task<IEnumerable<UserBook>> GetUsersByBookAsync(int bookId)
        {
            return await _appDbContext.UserBooks
                .Include(ub => ub.User)
                .Where(ub => ub.BookId == bookId)
                .ToListAsync();
        }

        public async Task AddUserBookAsync(UserBook userBook)
        {
            await _appDbContext.UserBooks.AddAsync(userBook);
            await _appDbContext.SaveChangesAsync();
        }
        public async Task UpdateUserBookAsync(UserBook userBook)
        {
            // No need to call .Update() because EF is tracking the object
            await _appDbContext.SaveChangesAsync();
        }
        public async Task RemoveUserBookAsync(UserBook userBook)
        {
            _appDbContext.UserBooks.Remove(userBook);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int userId, int bookId)
        {
            return await _appDbContext.UserBooks.AnyAsync(
                ub => ub.UserId == userId && ub.BookId == bookId);
        }
    }
}
