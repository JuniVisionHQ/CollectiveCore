import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import type { User } from '../types/user';
import type { Book } from '../types/book';
import type { UserBook } from '../types/userBook';
import BookDetailsPanel from '../components/BookDetailsPanel';
import { getBooksByUser } from '../api/userBooks';
import { getCurrentUserBooks } from '../api/userBooks';

import UserProfile from '../components/UserProfile';
import UserBooksList from '../components/UserBooksList';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "@/shadcn/components/ui/resizable";

export default function UserProfilePage() {
    const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();

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

    useEffect(() => {
        const fetchUser = async () => {
            if (!isAuthenticated) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const token = await getAccessTokenSilently();
                const response = await axios.get<User>('/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [isAuthenticated, getAccessTokenSilently]);

    // Fetch userBooks only if logged in
    useEffect(() => {
        if (!isAuthenticated) return;

        async function fetchUserBooks() {
            setUserBooksLoading(true);
            setUserBooksError(null);

            try {
                const token = await getAccessTokenSilently();

                const userBooksData = await getCurrentUserBooks(token);
                // const userBooksData = await getBooksByUser(userId);
                //const userBooksData = await getCurrentUserBooks(); 
                // setUserBooks(userBooksData);
                setUserBooks(userBooksData);
            } catch {
                setUserBooksError('Failed to load user books');
            } finally {
                setUserBooksLoading(false);
            }
        }

        fetchUserBooks();
    }, [isAuthenticated, getAccessTokenSilently]);

    if (authLoading || loading) return <p>Loading user profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!isAuthenticated) return <p>You must be logged in to view this page.</p>;
    if (!user) return <p>User not found.</p>;

    // User clicks a book in the list
    function handleSelectBook(userBook: UserBook) {
        setSelectedUserBook(userBook);
        setSelectedBook({
            id: userBook.bookId,
            title: userBook.title,
            author: userBook.author,
            bookCoverImageFileName: userBook.bookCoverImageFileName ?? '',
        });
    }

    return (
        <div className="myapp-userprofile-container h-[80vh] flex flex-col flex-1 min-h-0">
            <ResizablePanelGroup direction="vertical" className="border flex-1 min-h-0 border-none">
                <ResizablePanel defaultSize={10} className="flex flex-col min-h-0 p-4">
                    {/* <h1>User Profile</h1> */}
                    <UserProfile user={user} />

                </ResizablePanel>
                <ResizablePanel defaultSize={90} className="flex flex-col min-h-0 resizeable-border-color">
                    <ResizablePanelGroup direction="horizontal" className="border flex-1 min-h-0 border-none">
                        <ResizablePanel defaultSize={40} className="flex flex-col min-h-0">
                            {isAuthenticated ? (
                                <UserBooksList
                                    userBooks={userBooks}
                                    userBooksLoading={userBooksLoading}
                                    userBooksError={userBooksError}
                                    onSelectBook={handleSelectBook} // Pass the whole UserBook
                                />
                            ) : (
                                <p className="p-4">Please log in to see your books.</p>
                            )}
                        </ResizablePanel>

                        <ResizableHandle withHandle className="resizeable-withHandle-color" />

                        <ResizablePanel defaultSize={60} className="flex flex-col min-h-0">
                            {/* Pass both book and userBook to details */}
          
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}