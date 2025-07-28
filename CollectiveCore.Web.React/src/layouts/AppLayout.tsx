import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import BookFormModal from '../components/BookFormModal';

export default function AppLayout() {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

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
          {/* <a href="/add-book" className="nav-link">Add Book</a> */}
          <a href="/profile" className="nav-link">Profile</a>
          
          {/* Add Book triggers modal open */}
          <button
            className="nav-link"
            onClick={() => setIsBookModalOpen(true)}
            type="button"
          >
            Add Book
          </button>
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
        <Outlet />
      </main>

    </div>
  );
}