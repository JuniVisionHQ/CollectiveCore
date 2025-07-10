import React, { useState, useEffect } from 'react';
import { getAllBooks } from '../api/books';

interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  genre?: string;
  yearPublished?: number;
  bookCoverImageUrl?: string;
}

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);  // state to hold books array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
        try {
            const booksResponse = await getAllBooks(); // from books.ts
            setBooks(booksResponse);
        } catch (err) {
            setError('Failed to load books.');
        } finally {
            setLoading(false);
        }
  };

  fetchBooks();

  }, []);

  return (
    <div>
     {loading && <p>Loading books...</p>}
     {error && <p style={{ color: 'red' }}>{error}</p>}

     {!loading && !error && (
      <section className="book-section">
        
          <ul className="book-list">
              {books.map((book) => (
              <li key={book.id} className="book-item card">
                  <strong>{book.title}</strong> by {book.author}
              </li>
              ))}
          </ul>
        </section>
     )}


    </div>
  );
}
