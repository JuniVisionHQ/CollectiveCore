import type { Book } from '../types/book';
import type { UserBook } from '../types/userBook';

type BookDetailsPanelProps = {
  book: Book | null;
  userBook: UserBook | null;
};

export default function BookDetailsPanel({ book, userBook }: BookDetailsPanelProps) {
  if (!book) {
    return <p className="p-4 text-gray-600">Select a book to view details</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{book.title}</h2>
      <p className="text-sm text-gray-700">Author: {book.author}</p>
      
      {/* User-specific info */}
      {userBook && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Favorite: {userBook.isFavorite ? 'Yes' : 'No'}</p>
          <p>Read: {userBook.hasRead ? 'Yes' : 'No'}</p>
        </div>
      )}

    </div>
  );
}