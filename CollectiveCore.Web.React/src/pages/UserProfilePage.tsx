import React, { useState, useEffect } from 'react';
import type { User } from '../types/user';
import type { Book } from '../types/book';
import type { UserBook } from '../types/userBook';
import BookDetailsPanel from '../components/BookDetailsPanel';

import { getUserById } from '../api/users';
import { getBooksByUser } from '../api/userBooks';

import UserProfile from '../components/UserProfile';
import UserBooksList from '../components/UserBooksList';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "@/shadcn/components/ui/resizable";

export default function UserProfilePage() {

    const userId = 1; // Hardcoded for now
    
    const isLoggedIn = true; // TODO: Replace with actual auth logic

    // User data
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // User books data
    const [userBooks, setUserBooks] = useState<UserBook[]>([]);
    const [userBooksLoading, setUserBooksLoading] = useState(true);
    const [userBooksError, setUserBooksError] = useState<string | null>(null);

    // Selected book + userBook relationship for details panel
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedUserBook, setSelectedUserBook] = useState<UserBook | null>(null);

    // Fetch user
    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            setError(null);

            try {
                const userData = await getUserById(userId);
                setUser(userData);
            } catch (err) {
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [userId]);


    // Fetch userBooks only if logged in
    useEffect(() => {
        if (!isLoggedIn) return;

        async function fetchUserBooks() {
            setUserBooksLoading(true);
            setUserBooksError(null);

            try {
                const userBooksData = await getBooksByUser(userId);
                setUserBooks(userBooksData);
            } catch {
                setUserBooksError('Failed to load user books');
            } finally {
                setUserBooksLoading(false);
            }
        }

        fetchUserBooks();
    }, [userId, isLoggedIn]);

    if (loading) return <p>Loading user profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!user) return <p>User not found.</p>;

    // Handler: when user clicks a book in the list
     function handleSelectBook(userBook: UserBook) {
        setSelectedUserBook(userBook);
        // Construct a minimal Book object from userBook info (or fetch full book if needed)
        setSelectedBook({
          id: userBook.bookId,
          title: userBook.title,
          author: userBook.author,
          bookCoverImageFileName: userBook.bookCoverImageFileName ?? '',
          // You can add other book properties here if you have them in UserBook
        });
    }

    return (
        <div className="myapp-userprofile-container h-[80vh] flex flex-col flex-1 min-h-0">
            <ResizablePanelGroup direction="vertical" className="border flex-1 min-h-0">
                <ResizablePanel defaultSize={20} className="flex flex-col min-h-0 ">
                    <h1>User Profile</h1>
                    <UserProfile user={user} />

                </ResizablePanel>
                <ResizablePanel defaultSize={80} className="flex flex-col min-h-0">
                    <ResizablePanelGroup direction="horizontal" className="border flex-1 min-h-0">
                        <ResizablePanel defaultSize={40} className="flex flex-col min-h-0">
                            {isLoggedIn ? (
                            <UserBooksList
                                userBooks={userBooks}
                                userBooksLoading={userBooksLoading}
                                userBooksError={userBooksError}
                                onSelectBook={handleSelectBook} // Pass the whole UserBook
                                />
                            ) : (
                                <p className="p-4 text-gray-600">Please log in to see your books.</p>
                            )}
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        <ResizablePanel defaultSize={60} className="flex flex-col min-h-0">
                            {/* Pass both book and userBook to details */}
                            <BookDetailsPanel
                                book={selectedBook}
                                userBook={selectedUserBook}
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}