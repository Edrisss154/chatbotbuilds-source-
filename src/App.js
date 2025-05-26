import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import NetworkBackground3D from './page/NetworkBackground3D';
import ChatButton from './page/ChatButton';
import Login from './page/Login';
import { ThemeProvider, useTheme } from './ThemeContext';
import { AuthProvider, useAuth } from './page/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const { sessionId } = useTheme();
    // اگر کاربر لاگین کرده و sessionId دارد، به صفحه اصلی هدایت شود
    if (user && sessionId) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const App = () => {
    const { isDark } = useTheme();
    const { user, logout } = useAuth();

    return (
        <Router>
            <div className="relative w-full h-screen bg-transparent transition-colors duration-300 text-black dark:text-white overflow-hidden">
                <NetworkBackground3D />
                <div className="relative z-10">

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