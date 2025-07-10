import React from 'react';
import { useEffect } from "react";
import BooksList from './components/BooksList';

function App() {

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
    localStorage.removeItem("theme"); // remove from storage
  };

  return (
    <div className="app-container">
      <h1>CollectiveCore Web</h1>

      <div className="theme-switcher vertical">
        <span className="theme-label">Choose Theme</span>    
        <button onClick={() => setTheme("dark-mode")}>Dark</button>
        <button onClick={() => setTheme("warm-cozy")}>Cozy</button>
        <button onClick={() => setTheme("glass")}>Glass</button>
        <button onClick={resetTheme}>Reset</button>
      </div>

      <h1>All Books</h1>

      <BooksList />
    </div>
  );
}

export default App;
