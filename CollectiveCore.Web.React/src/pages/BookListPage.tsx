import React, { useState, useEffect } from 'react';
import BooksList from '../components/BooksList';
import BookDetailsPanel from '../components/BookDetailsPanel';
import { getAllBooks } from '../api/books';
import type { Book } from '../types/book';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "@/shadcn/components/ui/resizable"

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);  // state to hold books array
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
        try {
            const booksResponse = await getAllBooks(); // from books.ts
            setBooks(booksResponse);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch books:', err);
            setError("Something went wrong while loading your books."); 
        } finally {
            setLoading(false);
        }
  };

  fetchBooks();

  }, []);

  return (
    <div className="myapp-bookpage-container h-[80vh] flex flex-col flex-1 min-h-0"> 
      <ResizablePanelGroup direction="horizontal" className="border flex-1 min-h-0">
        <ResizablePanel defaultSize={40} className="flex flex-col min-h-0">
          <BooksList
            books={books}
            loading={loading}
            error={error}
            onSelectBook={setSelectedBook}
          
          />
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel defaultSize={60} className="flex flex-col min-h-0">
          <BookDetailsPanel book={selectedBook} userBook={null}/> {/*Book details in right panel*/}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}