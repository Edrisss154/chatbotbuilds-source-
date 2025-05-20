import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ChatButton from './page/ChatButton';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('darkMode');
        return savedTheme !== null ? savedTheme === 'true' : true;
    });
    const [sessionId, setSessionId] = useState(() => {
        const savedSessionId = localStorage.getItem('sessionId');
        return savedSessionId || uuidv4();
    });

    useEffect(() => {
        localStorage.setItem('darkMode', isDark);
        localStorage.setItem('sessionId', sessionId);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark, sessionId]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, sessionId }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

const App = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <Router>
            <div className="relative w-full h-screen bg-white dark:bg-[#121212] transition-colors duration-300 text-black dark:text-white overflow-hidden">
                <div className="absolute top-4 right-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {isDark ? '🌞' : '🌙'}
                    </button>
                </div>

                <Routes>
                    <Route path="/" element={<ChatButton />} />
                </Routes>
            </div>
        </Router>
    );
};

const WrappedApp = () => (
    <ThemeProvider>
        <App />
    </ThemeProvider>
);

export default WrappedApp;