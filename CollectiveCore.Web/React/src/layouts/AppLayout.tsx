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
    <div className="app-container">
      <h1>CollectiveCore Web</h1>

      <div className="theme-switcher vertical">
        <span className="theme-label">Choose Theme</span>    
        <button onClick={() => setTheme("dark-mode")}>Dark</button>
        <button onClick={() => setTheme("warm-cozy")}>Cozy</button>
        <button onClick={() => setTheme("glass")}>Glass</button>
        <button onClick={resetTheme}>Reset</button>
      </div>

      {/* Renders the matched route’s element */}
      <Outlet />
    </div>
  );
}