using CollectiveCore.Models;

namespace CollectiveCore.Api.Repositories
{
    public interface IBookRepository
    {
        Task<IEnumerable<Book>> GetBooks();
        Task<Book> GetBook(int bookId);
        Task<Book> AddBook(Book book);
        Task<Book> UpdateBook(Book book);
        Task<Book?> DeleteBook(int bookId);
    }
}
