import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import NetworkBackground3D from './page/NetworkBackground3D';
import ChatButton from './page/ChatButton';
import Login from './page/Login';
import { ThemeProvider, useTheme } from './ThemeContext'; // مسیر جدید
import { AuthProvider, useAuth } from './page/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? <Navigate to="/" replace /> : children;
};

const App = () => {
    const { isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    return (
        <Router>
            <div className="relative w-full h-screen bg-transparent transition-colors duration-300 text-black dark:text-white overflow-hidden">
                <NetworkBackground3D />
                <div className="relative z-10">
                    <div className="absolute top-4 right-4 flex space-x-2">

                        {user ? (
                            <button
                                onClick={logout}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Logout"
                            >
                                خروج
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Sign Up"
                            >
                                <UserPlusIcon className="h-6 w-6 text-black dark:text-white" />
                            </Link>
                        )}
                    </div>
                    <Routes>
                        <Route path="/" element={<ChatButton />} />
                        <Route
                            path="/login"
                            element={
                                <ProtectedRoute>
                                    <Login />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

const WrappedApp = () => (
    <ThemeProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ThemeProvider>
);

export default WrappedApp;