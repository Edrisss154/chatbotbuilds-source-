import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import NetworkBackground3D from './page/NetworkBackground3D';
import ChatButton from './page/ChatButton';
import Login from './page/Login'; // Adjust path as needed

// Theme Context
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

// Main App Component
const App = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <Router>
            <div className="relative w-full h-screen bg-transparent transition-colors duration-300 text-black dark:text-white overflow-hidden">
                <NetworkBackground3D />
                <div className="relative z-10">
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Toggle Theme"
                        >
                            {isDark ? '🌞' : '🌙'}
                        </button>
                        <Link
                            to="/login"
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Sign Up"
                        >
                            <UserPlusIcon className="h-6 w-6 text-black dark:text-white" />
                        </Link>
                    </div>
                    <Routes>
                        <Route path="/" element={<ChatButton />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

// Wrapped App
const WrappedApp = () => (
    <ThemeProvider>
        <App />
    </ThemeProvider>
);

export default WrappedApp;