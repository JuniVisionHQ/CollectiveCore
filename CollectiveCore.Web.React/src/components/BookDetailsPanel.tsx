import type { Book } from '../types/book';
import type { UserBook } from '../types/userBook';

const SITE_ROOT_URL = import.meta.env.VITE_SITE_ROOT_URL;

type BookDetailsPanelProps = {
  book: Book | null;
  userBook: UserBook | null;
};

export default function BookDetailsPanel({ book, userBook }: BookDetailsPanelProps) {
  if (!book) {
    return <p className="p-6">Select a book to view details</p>;
  }

  return (
    <div className="p-4 flex flex-col py-16">
      <div className="book-details flex flex-row gap-6">
        <div className="book-details-image-container w-1/4">
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
        <div className="flex flex-col justify-start space-y-2 w-3/4">

          {/* Book Info */}
          <h2 className="text-xl font-bold">{book.title}</h2>
          <p className="text-sm">Author: <span className="text-md font-bold">{book.author}</span></p>
          <p className="text-sm">Year Published: {book.yearPublished}</p>
          <p className="text-sm">Genre: {book.genre}</p>
          <p className="text-sm">Description: {book.description}</p>
        </div>
      </div>
      {/* User Notes */}
      <div className="flex flex-col">
        {/* User Flags */}
          {userBook && (
            <div className="mt-4 text-sm">
              <p>Favorite: {userBook.isFavorite ? 'Yes' : 'No'}</p>
              <p>Read: {userBook.hasRead ? 'Yes' : 'No'}</p>
              <h3 className="font-semibold mt-2 py-1">Notes</h3>
              <p className="py-1">Notes here</p>
            </div>
          )}
      </div>
    </div>
  );
}