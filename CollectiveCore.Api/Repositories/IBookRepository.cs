using CollectiveCore.Models;

namespace CollectiveCore.Api.Repositories
{
    public interface IBookRepository
    {
        Task<IEnumerable<Book>> GetBooksAsync();
        Task<Book?> GetBookAsync(int bookId);
        Task<Book> AddBookAsync(Book book);
        Task<Book?> UpdateBookAsync(Book book);
        Task<Book?> DeleteBookAsync(int bookId);
    }
}
