import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher() {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    // Set initial theme based on localStorage or system preference
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-800/20 hover:bg-gray-700/30 transition-colors duration-200 backdrop-blur-md border border-gray-700/50"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Sun size={18} className="text-yellow-300" />
      ) : (
        <Moon size={18} className="text-blue-300" />
      )}
    </button>
  );
}