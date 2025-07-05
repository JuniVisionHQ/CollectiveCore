using CollectiveCore.Models;

namespace CollectiveCore.Api.Repositories
{
    public interface IUserBookRepository
    {
        Task<UserBook?> GetUserBookRelationshipAsync(int userId, int bookId);

        Task<IEnumerable<UserBook>> GetBooksByUserAsync(int userId);
        Task<IEnumerable<UserBook>> GetUsersByBookAsync(int bookId);

        Task AddUserBookAsync(UserBook userBook);
        Task RemoveUserBookAsync(UserBook userBook);

        Task<bool> ExistsAsync(int userId, int bookId);
    }
}
