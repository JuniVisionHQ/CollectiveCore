using CollectiveCore.Models;

namespace CollectiveCore.Api.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetUsers();
        Task<User> GetUser(int userId);
        Task<User> AddUser(User user);
        Task<User> UpdateUser(User user);
        Task<User?> DeleteUser(int userId);

        Task<User?> GetUserByEmail(string email);
    }
}
