import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import { FaHandPaper, FaRobot, FaRegSmile } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { useTheme } from '../ThemeContext';

const messages = [
  {
    text: 'دستیار هوش مصنوعی ساتیا',
    icons: <FaRobot className="h-5 w-5 text-emerald-400 dark:text-neon-green" />,
  },
  {
    text: 'خوشحال می‌شویم پاسخگوی سوالات شما باشیم.',
    icons: <FaRobot className="h-5 w-5 text-emerald-400 dark:text-neon-green" />,
  },
  {
    text: 'چه کمکی از دستم برمیاد؟',
    icons: <FaRobot className="h-5 w-5 text-emerald-400 dark:text-neon-green" />,
  },
  {
    text: 'می‌تونم در پیدا کردن اطلاعات، نوشتن متن، یا حل مشکلات برنامه‌نویسی کمکت کنم!',
    icons: <FaRobot className="h-5 w-5 text-emerald-400 dark:text-neon-green" />,
  },
  {
    text: 'برای شروع فقط کافیه سوالتو بپرسی.',
    icons: <FaRobot className="h-5 w-5 text-emerald-400 dark:text-neon-green" />,
  },
  {
    text: 'من همیشه اینجام تا کمک کنم ✨',
    icons: (
        <div className="flex items-center gap-1">
          <FaRegSmile className="h-5 w-5 text-emerald-400 dark:text-neon-green" />
          <FaRobot className="h-5 w-5 text-emerald-400 dark:text-neon-green" />
        </div>
    ),
  },
];

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const { user } = useAuth();
  const { sessionId } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setShowMessage(true);
    const openChatTimeout = setTimeout(() => {
      // فقط اگر کاربر لاگین کرده باشد، چت به‌صورت خودکار باز شود
      if (user && sessionId) {
        setIsOpen(true);
      }
    }, 1000);

    const interval = setInterval(() => {
      setShowMessage(false);
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setShowMessage(true);
      }, 1000);
    }, 4000);

    return () => {
      clearTimeout(openChatTimeout);
      clearInterval(interval);
    };
  }, [user, sessionId]);

  const handleButtonClick = () => {
    if (user && sessionId) {
      // اگر کاربر لاگین کرده، چت را باز کن
      setIsOpen(true);
    } else {
      // اگر کاربر لاگین نکرده، به صفحه لاگین هدایت کن
      navigate('/login');
    }
  };

  return (
      <div className="relative">
        {showMessage && !isOpen && (
            <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 flex items-center gap-2 rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md dark:bg-gray-800">
              {messages[currentMessageIndex].icons}
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {messages[currentMessageIndex].text}
                    </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-3 w-3 rotate-45 bg-white/90 dark:bg-gray-800"></div>
            </div>
        )}

        {!isOpen && (
            <button
                onClick={handleButtonClick}
                className="fixed top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/100 dark:bg-gradient-to-br dark:from-dark-blue dark:to-dark-purple backdrop-blur-xl border border-white/20 p-4 rounded-full shadow-xl shadow-neon-blue/80 hover:bg-neon-blue/90 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 transform transition-transform duration-200 animate__animated animate__bounceIn animate__pulse animate__infinite hover:animate__tada"
                aria-label="باز کردن چت با ربات هوش مصنوعی"
            >
              <svg
                  className="w-8 h-8 text-green-500 dark:text-neon-green hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
              >
                <path d="M12 2a10 10 0 00-10 10c0 1.8.5 3.5 1.4 5l-1.4 4 4-1.4A10 10 0 0012 22a10 10 0 000-20z" />
                <circle cx="9" cy="12" r="1" fill="#fff" />
                <circle cx="12" cy="12" r="1" fill="#fff" />
                <circle cx="15" cy="12" r="1" fill="#fff" />
              </svg>
            </button>
        )}

        {isOpen && (
            <>
              <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setIsOpen(false)}
              />
              <Chat
                  onClose={() => setIsOpen(false)}
                  chatHistory={chatHistory}
                  setChatHistory={setChatHistory}
              />
            </>
        )}
      </div>
  );
};

export default ChatButton;