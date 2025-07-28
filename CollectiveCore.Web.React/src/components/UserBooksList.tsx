import type { UserBook } from '../types/userBook';

const SITE_ROOT_URL = import.meta.env.VITE_SITE_ROOT_URL;

type Props = {
  userBooks: UserBook[];
  userBooksLoading: boolean;
  userBooksError: string | null;
  onSelectBook: (userBook: UserBook) => void;
};

export default function UserBooksList({ userBooks, userBooksLoading, userBooksError, onSelectBook }: Props) {
  if (userBooksLoading) return <div className="p-4">Loading your books…</div>;
  if (userBooksError) return <div className="p-4 text-red-500">{userBooksError}</div>;
  if (userBooks.length === 0) return <div className="p-4">You haven't added any books yet.</div>;

  return (
    <div className="myapp-booklist-container flex-1 min-h-0 overflow-y-auto scroll-smooth [scrollbar-gutter:stable] scrollbar-thin p-4">
      <h2 className="m-2">Your Books</h2>

      <ul className="grid gap-4 p-2 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {userBooks.map((ub) => (
          <li
            key={ub.bookId}
            className="book-item book-card aspect-[5/2] flex rounded-md p-2 max-w-[320px]"
            onClick={() => onSelectBook(ub)}
          >
            <div className="book-image-container flex-shrink-0 w-1/4 h-full overflow-hidden">
              <img
                src={
                  ub.bookCoverImageFileName
                    ? `${SITE_ROOT_URL}/images/${ub.bookCoverImageFileName}`
                    : '/images/book-cover-placeholder.png'
                }
                alt={`Cover of ${ub.title}`}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
            <div className="book-info flex flex-col justify-center px-2 overflow-hidden w-3/4">
              <p className="font-bold line-clamp-2">{ub.title}</p>
              <p className="text-sm truncate">{ub.author}</p>
              <div className="text-xs mt-1">
                {ub.isFavorite && <span>Favorite</span>}
                {ub.hasRead && <span className="ml-2">Read</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}