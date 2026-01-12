import React, { useState, useEffect } from 'react';
import { AdminThemeContext } from './AdminThemeContext';

export const AdminThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('admin-theme') || 'light');

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};