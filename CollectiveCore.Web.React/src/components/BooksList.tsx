import type { Book } from '../types/book';

const SITE_ROOT_URL = import.meta.env.VITE_SITE_ROOT_URL;

  type Props = {
    books: Book[];
    loading: boolean;
    error: string | null;
    onSelectBook: (book: Book) => void;
  };

export default function BooksList({ books, loading, error, onSelectBook }: Props) {
    if (loading) return <div className="p-4 text-gray-500">Loading books…</div>;

    if (error) return <div className="p-4 text-red-500">{error}</div>;

    if (books.length === 0) {
      return <div className="p-4 text-gray-500">No books found.</div>;
    }

  return (
    
    <div className="myapp-booklist-container flex-1 min-h-0 overflow-y-auto scroll-smooth [scrollbar-gutter:stable] scrollbar-thin p-4">
      <div className="book-list-search-bar">
        <h2 className="m-2">All Books - <i>Search filter coming soon!</i></h2>
      </div>

     {loading && <p>Loading books...</p>}
     {error && <p style={{ color: 'red' }}>{error}</p>}

     {!loading && !error && (
      <section className="book-list-section">              
          <ul className="grid gap-4 p-2 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
              {books.map((book) => (
              <li 
                key={book.id} 
                className="book-item book-card aspect-[5/2] flex rounded-md p-2 max-w-[320px]"
                onClick={() => onSelectBook(book)}
                >
                <div className="book-image-container flex-shrink-0 w-1/4 h-full overflow-hidden">
                  <img
                    src={
                      book.bookCoverImageFileName
                        ? `${SITE_ROOT_URL}/images/${book.bookCoverImageFileName}`
                        : '/images/book-cover-placeholder.png'
                    }
                    alt={`Cover of ${book.title}`}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
                 <div className="book-info flex flex-col justify-center px-2 overflow-hidden w-3/4">
                  <p className="font-bold line-clamp-2">{book.title}</p>
                  <p className="text-sm truncate">{book.author}</p>
                </div>
              </li>
              ))}
          </ul>
        </section>
     )}

    </div>
  );
}