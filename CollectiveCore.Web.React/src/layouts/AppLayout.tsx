import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
 
export default function AppLayout() {

    useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

    const setTheme = (theme: string) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme); // store theme
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
            <a href="/add-book" className="nav-link">Add Book</a>
            <a href="/profile" className="nav-link">Profile</a>
        </nav>
      </header>

      <main className="myapp-main-container w-full h-full">
        {/* Renders the matched route’s element */}
        <Outlet />
      </main>

    </div>
  );
}