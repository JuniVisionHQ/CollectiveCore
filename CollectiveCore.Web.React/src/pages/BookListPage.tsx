import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useOutletContext } from 'react-router';

import BooksList from '../components/BooksList';
import BookDetailsPanel from '../components/BookDetailsPanel';

import { getAllBooks } from '../api/books';
import { getCurrentUserBooks, addBookToUser, removeBookFromUser } from '../api/userBooks';

import type { Book } from '../types/book';
import type { User } from '../types/user';
import type { UserBook } from "../types/userBook";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "@/shadcn/components/ui/resizable"

type OutletContextType = {
  currentUser: User | null;
  refreshKey: number;
};

export default function BookListPage() {
  const { currentUser, refreshKey } = useOutletContext<OutletContextType>();
  const [books, setBooks] = useState<Book[]>([]);  // state to hold books array
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();

   // Fetch all books (public)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Always fetch all books
        const allBooksResponse = await getAllBooks(); // from books.ts
        setBooks(allBooksResponse);

      } catch (err) {
        console.error('Failed to fetch books:', err);
        setError("Something went wrong while loading your books.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [refreshKey]); // Refetch when refreshKey changes


  // Fetch user's books (private) when authenticated
  useEffect(() => {
    const fetchUserBooks = async () => {
      if (!isAuthenticated) {
        setUserBooks([]);
        return;
      }
      try {
        const token = await getAccessTokenSilently();
        const userBooksResponse = await getCurrentUserBooks(token);
        setUserBooks(userBooksResponse);
      } catch (err) {
        console.error("Failed to fetch user books:", err);
        setUserBooks([]);
      }
    };

    if (!authLoading) fetchUserBooks();
  }, [isAuthenticated, authLoading, getAccessTokenSilently, refreshKey]); // also refresh userBooks

   // Add book to current user's collection
  const handleAddToCollection = async (bookId: number) => {
    if (!isAuthenticated) return;

    try {
      const token = await getAccessTokenSilently();
      await addBookToUser(token, bookId);

      // Just update userBooks – avoids full refresh
      const updatedBooks = await getCurrentUserBooks(token);
      setUserBooks(updatedBooks);
    } catch (err) {
      console.error("Error adding book to collection:", err);
    }
  };

  // Remove book to current user's collection
  const handleRemoveFromCollection = async (bookId: number) => {
    if (!isAuthenticated) return;

    try {
      const token = await getAccessTokenSilently();
      await removeBookFromUser(token, bookId);

      // Refresh userBooks and allBooks after removing
      const updatedBooks = await getCurrentUserBooks(token);
      setUserBooks(updatedBooks);
    } catch (err) {
      console.error("Error adding book to collection:", err);
    }
  };

  if (loading) return <p>Loading books...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;  

  return (
    <div className="myapp-bookpage-container h-[80vh] flex flex-col flex-1 min-h-0">
      <ResizablePanelGroup direction="horizontal" className="border flex-1 min-h-0 border-none">
        <ResizablePanel defaultSize={40} className="flex flex-col min-h-0">
          <BooksList
            books={books}
            userBooks={userBooks}
            onSelectBook={setSelectedBook}
            isAuthenticated={!!currentUser} //Using currentUser instead of Auth0 directly
            onAddToCollection={handleAddToCollection}
          />
        </ResizablePanel>

        <ResizableHandle withHandle className="resizeable-withHandle-color" />
        
        <ResizablePanel defaultSize={60} className="flex flex-col min-h-0">
          <BookDetailsPanel
            book={selectedBook}
            userBook={
              selectedBook
                ? userBooks.find((ub) => ub.bookId === selectedBook.id) || null
                : null
            }
            onAddToCollection={handleAddToCollection}
            onRemoveFromCollection={handleRemoveFromCollection}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}