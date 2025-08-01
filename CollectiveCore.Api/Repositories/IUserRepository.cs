using CollectiveCore.Models;

namespace CollectiveCore.Api.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User?> GetUserAsync(int userId);
        Task<User> AddUserAsync(User user);
        Task<User?> UpdateUserAsync(User user);
        Task<User?> DeleteUserAsync(int userId);

        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByAuth0UserIdAsync(string auth0UserId);

        Task<User?> GetUserByUserNameAsync(string userName);
    }
}
