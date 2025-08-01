import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import BookFormModal from '../components/BookFormModal';
import AuthButtons from '../components/AuthButtons';
import { useAuth0 } from '@auth0/auth0-react';
import { getCurrentUser } from '../api/users';
import type { User } from '../types/user';


export default function AppLayout() {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch current user after login
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const token = await getAccessTokenSilently();
        const response = await getCurrentUser(token);
        setCurrentUser(response);
        console.log('Fetched current user:', response);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    if (isAuthenticated && !currentUser) {
      fetchCurrentUser();
    } else if (!isAuthenticated) {
      setCurrentUser(null);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleAddBookClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect(); // redirect to Auth0 login
    } else {
      setIsBookModalOpen(true); // open modal
    }
  };

  // Theme Choice
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const setTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); //save theme in local storage
  };

  const resetTheme = () => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="app-header h-32 shrink-0">
        <div className="theme-switcher">
          <span className="theme-label">Site Theme: </span>
          <button className="theme-button" onClick={resetTheme}>Light</button>
          <button className="theme-button" onClick={() => setTheme("dark-mode")}>Dark</button>
          <button className="theme-button" onClick={() => setTheme("warm-cozy")}>Cozy</button>
        </div>

        <h1 className="text-3xl font-bold text-left px-6">CollectiveCore</h1>

        <nav className="main-nav flex justify-left gap-8 py-4 px-6 text-lg font-semibold">
          <a href="/" className="nav-link">All Books</a>
          {/* <a href="/profile" className="nav-link">Profile</a> */}

          {/* Add Book triggers modal open */}
          <button
            className="nav-link"
            onClick={handleAddBookClick}
            type="button"
          >
            Add Book
          </button>
          {/* Auth Buttons */}
          <AuthButtons />
        </nav>
      </header>

      {/* Modal component - controlled via isBookModalOpen state */}
      <BookFormModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        mode="create"
      />

      <main className="myapp-main-container w-full h-full">
        {/* Renders the matched route’s element */}
        <Outlet context={{ currentUser }} />
      </main>

    </div>
  );
}