import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NetworkBackground3D from './NetworkBackground3D';
import { useTheme } from '../ThemeContext';
import { useAuth } from './AuthContext';

const Login = () => {
    const { isDark, sessionId, setSessionId } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [user, setUser] = useState(null);

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: '1042696976513-lcm7rd87354l0i71dfregeitln1mlucf.apps.googleusercontent.com',
                callback: handleGoogleSignIn,
            });

            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInButton'),
                {
                    theme: isDark ? 'filled_black' : 'outline',
                    size: 'large',
                    width: '400',
                    text: isLoginMode ? 'signin_with' : 'signup_with',
                }
            );
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [isDark, isLoginMode]);


    const handleGoogleSignIn = (response) => {
        const credential = response.credential;
        console.log('توکن گوگل:', credential);

        const decodedToken = jwtDecode(credential);
        console.log('اطلاعات رمزگشایی‌شده کاربر:', decodedToken);

        const userInfo = {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
        };
        setUser(userInfo);
        login(userInfo);

        // انکد کردن ایمیل با Base64
        const encodedEmail = btoa(userInfo.email);
        const newSessionId = encodedEmail;
        setSessionId(newSessionId);
        localStorage.setItem('sessionId', newSessionId);

        sendToBackend(credential);
        navigate('/');
    };

    const sendToBackend = async (token) => {
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();
            console.log('پاسخ سرور:', data);
        } catch (error) {
            console.error('خطا در ارسال به سرور:', error);
        }
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
                        {isLoginMode ? 'ورود' : 'ثبت‌نام'}
                    </h2>
                    {user && (
                        <div className="mb-6 text-center">
                            <h3 className="text-lg text-black dark:text-white">
                                خوش آمدید، {user.name}!
                            </h3>
                            <p className="text-sm text-black dark:text-white">ایمیل: {user.email}</p>
                            {user.picture && (
                                <img
                                    src={user.picture}
                                    alt="پروفایل"
                                    className="mt-2 rounded-full w-16 h-16 mx-auto"
                                />
                            )}
                        </div>
                    )}
                    <form>
                        {!isLoginMode && (
                            <div className="mb-4">
                                <label
                                    className="block text-sm mb-2 text-black dark:text-white"
                                    htmlFor="username"
                                >
                                    نام کاربری
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                                    placeholder="نام کاربری خود را وارد کنید"
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label
                                className="block text-sm mb-2 text-black dark:text-white"
                                htmlFor="email"
                            >
                                ایمیل
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                                placeholder="ایمیل خود را وارد کنید"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-sm mb-2 text-black dark:text-white"
                                htmlFor="password"
                            >
                                رمز عبور
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                                placeholder="رمز عبور خود را وارد کنید"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            {isLoginMode ? 'ورود' : 'ثبت‌نام'}
                        </button>
                    </form>
                    <div className="mt-6 flex justify-center">
                        <div id="googleSignInButton" className="w-full max-w-[400px]"></div>
                    </div>
                    <p className="text-sm mt-4 text-center text-black dark:text-white">
                        {isLoginMode ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کردید؟'}{' '}
                        <button
                            onClick={toggleMode}
                            className="text-blue-400 hover:underline focus:outline-none"
                        >
                            {isLoginMode ? 'ثبت‌نام' : 'ورود'}
                        </button>
                    </p>
                    <p className="text-sm mt-2 text-center text-black dark:text-white">
                        <Link to="/" className="text-blue-400 hover:underline">
                            بازگشت به خانه
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;