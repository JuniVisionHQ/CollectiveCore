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

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _appDbContext.Users.ToListAsync();
        }
        public async Task<User> GetUser(int userId)
        {
            return await _appDbContext.Users
                .FirstOrDefaultAsync(e => e.Id == userId);
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _appDbContext.Users
                .FirstOrDefaultAsync(e => e.Email == email);
        }

        public async Task<User> AddUser(User user)
        {
            var result = await _appDbContext.Users.AddAsync(user);
            await _appDbContext.SaveChangesAsync();
            return result.Entity;
        }
        public async Task<User> UpdateUser(User user)
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
        public async Task<User?> DeleteUser(int userId)
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
