import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NetworkBackground3D from './NetworkBackground3D';
import { useTheme } from '../App'; // Adjusted to use ThemeContext.js

const Login = () => {
    const { isDark } = useTheme();
    const [isLoginMode, setIsLoginMode] = useState(true);

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
    };

    // Initialize Google Sign-In
    useEffect(() => {
        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // Initialize Google button when script loads
        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: '1042696976513-lcm7rd87354l0i71dfregeitln1mlucf.apps.googleusercontent.com', // Replace with your Client ID
                callback: handleGoogleSignIn,
            });

            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInButton'),
                {
                    theme: isDark ? 'filled_black' : 'outline', // Match dark/light theme
                    size: 'large',
                    width: '400', // Match form width
                    text: isLoginMode ? 'signin_with' : 'signup_with', // Adjust text based on mode
                }
            );
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [isDark, isLoginMode]); // Re-render button when theme or mode changes

    // Handle Google Sign-In response
    const handleGoogleSignIn = (response) => {
        // JWT token from Google
        const credential = response.credential;
        console.log('Google JWT:', credential);
        // TODO: Send credential to your backend for verification
        // Example: fetch('/api/auth/google', { method: 'POST', body: JSON.stringify({ token: credential }) })
    };

    return (
        <div className="relative min-h-screen">
            <NetworkBackground3D />
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <div
                    className={`bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md ${
                        isDark ? 'dark:bg-gray-800' : ''
                    }`}
                >
                    <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">
                        {isLoginMode ? 'Login' : 'Sign Up'}
                    </h2>
                    <form>
                        {!isLoginMode && (
                            <div className="mb-4">
                                <label
                                    className="block text-sm mb-2 text-black dark:text-white"
                                    htmlFor="username"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label
                                className="block text-sm mb-2 text-black dark:text-white"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-sm mb-2 text-black dark:text-white"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            {isLoginMode ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                    <div className="mt-6 flex justify-center">
                        <div id="googleSignInButton" className="w-full max-w-[400px]"></div>
                    </div>
                    <p className="text-sm mt-4 text-center text-black dark:text-white">
                        {isLoginMode ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            onClick={toggleMode}
                            className="text-blue-400 hover:underline focus:outline-none"
                        >
                            {isLoginMode ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                    <p className="text-sm mt-2 text-center text-black dark:text-white">
                        <Link to="/" className="text-blue-400 hover:underline">
                            Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;