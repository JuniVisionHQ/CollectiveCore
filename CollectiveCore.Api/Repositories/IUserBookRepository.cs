using CollectiveCore.Models;

namespace CollectiveCore.Api.Repositories
{
    public interface IUserBookRepository
    {
        Task<IEnumerable<UserBook>> GetAllAsync();
        Task<UserBook?> GetByIdsAsync(int userId, int bookId);

        Task<IEnumerable<Book>> GetBooksByUserAsync(int userId);
        Task<IEnumerable<User>> GetUsersByBookAsync(int bookId);

        Task AddAsync(UserBook userBook);
        Task RemoveAsync(UserBook userBook);

        Task<bool> ExistsAsync(int userId, int bookId);
        Task SaveChangesAsync();
    }
}
