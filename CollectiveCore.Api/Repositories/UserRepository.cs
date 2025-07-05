using CollectiveCore.Api.Data;
using CollectiveCore.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace CollectiveCore.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _appDbContext;
        public UserRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _appDbContext.Users.ToListAsync();
        }
        public async Task<User?> GetUserAsync(int userId)
        {
            return await _appDbContext.Users
                .FirstOrDefaultAsync(e => e.Id == userId);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _appDbContext.Users
                .FirstOrDefaultAsync(e => e.Email == email);
        }

        public async Task<User> AddUserAsync(User user)
        {
            var result = await _appDbContext.Users.AddAsync(user);
            await _appDbContext.SaveChangesAsync();
            return result.Entity;
        }
        public async Task<User?> UpdateUserAsync(User user)
        {
            var result = await _appDbContext.Users
                .FirstOrDefaultAsync(e => e.Id == user.Id);

            if (result != null)
            {
                result.UserName = user.UserName;
                result.Email = user.Email;

                await _appDbContext.SaveChangesAsync();

                return result;
            }

            return null;
        }
        public async Task<User?> DeleteUserAsync(int userId)
        {
            var result = await _appDbContext.Users
                .FirstOrDefaultAsync(e => e.Id == userId);
            if (result != null)
            {
                _appDbContext.Users.Remove(result);
                await _appDbContext.SaveChangesAsync();
                return result;
            }
            return null;
        }

    }
}
