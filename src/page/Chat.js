import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askQuestion, fetchChatHistory } from './api';
import SettingsModal from './SettingsModal';
import SuggestedQuestions from './SuggestedQuestions';
import parse, { domToReact } from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../App';

// انیمیشن‌ها
const modalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.3, ease: 'easeIn' } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

const typingVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      opacity: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' },
    },
  },
};

const Chat = ({ onClose, chatHistory, setChatHistory }) => {
  const { isDark, sessionId } = useTheme();
  const [question, setQuestion] = useState('');
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = typeof window !== 'undefined' ? localStorage.getItem('darkMode') : null;
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [showScrollButton, setShowScrollButton] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [showScrollButtonByUser, setShowScrollButtonByUser] = useState(() => {
    const savedSetting = typeof window !== 'undefined' ? localStorage.getItem('showScroll') : null;
    return savedSetting ? JSON.parse(savedSetting) : false;
  });
  const [activeWebsockets, setActiveWebsockets] = useState({});
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // بارگذاری تاریخچه چت هنگام باز شدن کامپوننت
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await fetchChatHistory(sessionId, 0, 10);
        // اگر تاریخچه خالی است، فقط chatHistory را خالی تنظیم می‌کنیم
        if (!history || history.length === 0) {
          setChatHistory([]);
          return;
        }
        // معکوس کردن ترتیب تاریخچه برای نمایش از قدیم به جدید
        setChatHistory(
            history.reverse().map((item) => ({
              id: item.id.toString(),
              type: item.role === 'user' ? 'question' : 'answer',
              [item.role === 'user' ? 'text' : 'answer']: item.body,
              timestamp: new Date(item.created_at),
              isStreaming: false,
              sources: item.sources || [],
            }))
        );
      } catch (err) {
        console.error('Error loading chat history:', err);
        // فقط در صورتی خطا نمایش داده شود که مشکل واقعی وجود داشته باشد
        if (err.message !== 'خطا در دریافت تاریخچه چت') {
          setError('خطا در ارتباط با سرور');
        } else {
          setChatHistory([]); // در صورت خطای مربوط به تاریخچه، تاریخچه خالی نمایش داده شود
        }
      }
    };

    loadChatHistory();
  }, [sessionId, setChatHistory]);

  // اسکرول به انتهای چت
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // پاک کردن خطا پس از 3 ثانیه
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ذخیره تم در localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // ذخیره تنظیمات دکمه اسکرول
  useEffect(() => {
    localStorage.setItem('showScroll', JSON.stringify(showScrollButtonByUser));
  }, [showScrollButtonByUser]);

  // مدیریت دکمه اسکرول
  useEffect(() => {
    const updateScrollButtonVisibility = () => {
      const chatContainer = chatContainerRef.current;
      if (!chatContainer) return;

      if (chatHistory.length === 0) {
        setShowScrollButton(false);
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isScrollable = scrollHeight > clientHeight + 5;
      setShowScrollButton(isScrollable);

      if (isScrollable) {
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        const isNearTop = scrollTop < 50;

        if (isNearBottom) {
          setScrollDirection('up');
        } else if (isNearTop) {
          setScrollDirection('down');
        }
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const timer = setTimeout(updateScrollButtonVisibility, 100);
      chatContainer.addEventListener('scroll', updateScrollButtonVisibility);

      return () => {
        clearTimeout(timer);
        chatContainer.removeEventListener('scroll', updateScrollButtonVisibility);
      };
    }
  }, [chatHistory]);

  // تنظیم ارتفاع textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [question]);

  const handleSubmit = async (e, suggestion = null) => {
    e.preventDefault();
    const currentQuestion = suggestion || question;
    if (!currentQuestion.trim()) return;

    setQuestion('');
    setError(null);

    const questionId = uuidv4();
    const answerId = uuidv4();
    let answerBuffer = '';
    let tableBuffer = '';
    let isTableDetected = false;

    setChatHistory((prev) => [
      ...prev,
      { type: 'question', text: currentQuestion, timestamp: new Date(), id: questionId },
      { type: 'answer', answer: '', sources: [], timestamp: new Date(), isStreaming: true, id: answerId },
    ]);

    const ws = askQuestion(
        currentQuestion,
        sessionId,
        (message) => {
          console.log('Handling message:', message);

          let chunkData = '';
          if (typeof message === 'string') {
            chunkData = message;
            answerBuffer += chunkData;
          } else if (message.type === 'chunk' || message.message) {
            chunkData = message.type === 'chunk' ? message.data : message.message;
            answerBuffer += chunkData;
          } else if (message.type === 'error') {
            setError(message.message || 'خطا در دریافت پاسخ');
            finalizeResponse(answerId, answerBuffer, null, message.message);
            return;
          }

          if (chunkData.includes('<table') && !isTableDetected) {
            isTableDetected = true;
          }

          if (isTableDetected) {
            tableBuffer += chunkData;
            if (tableBuffer.includes('</tr>')) {
              setChatHistory((prev) => {
                const updatedHistory = [...prev];
                const lastMessage = updatedHistory.find((item) => item.id === answerId);
                if (lastMessage && lastMessage.type === 'answer' && lastMessage.isStreaming) {
                  lastMessage.answer = answerBuffer.replace(tableBuffer, '') + tableBuffer;
                }
                return updatedHistory;
              });
              tableBuffer = '';
            }
          } else {
            setChatHistory((prev) => {
              const updatedHistory = [...prev];
              const lastMessage = updatedHistory.find((item) => item.id === answerId);
              if (lastMessage && lastMessage.type === 'answer' && lastMessage.isStreaming) {
                lastMessage.answer = answerBuffer;
              }
              return updatedHistory;
            });
          }
        },
        (err) => {
          console.error('WebSocket error:', err);
          setError(err.message || 'خطا در اتصال WebSocket');
          finalizeResponse(answerId, answerBuffer, null, err.message);
        },
        () => {
          console.log('WebSocket closed');
          finalizeResponse(answerId, isTableDetected && tableBuffer ? tableBuffer : answerBuffer);
        }
    );

    setActiveWebsockets((prev) => ({
      ...prev,
      [answerId]: { ws, answerBuffer },
    }));

    const timeout = setTimeout(() => {
      if (activeWebsockets[answerId]) {
        console.log('Timeout triggered, finalizing response');
        finalizeResponse(answerId, isTableDetected && tableBuffer ? tableBuffer : answerBuffer, null, 'پاسخ به موقع دریافت نشد');
        ws.close();
      }
    }, 30000);

    ws.onclose = (event) => {
      clearTimeout(timeout);
      console.log('WebSocket closed with code:', event.code, 'reason:', event.reason);
      finalizeResponse(answerId, isTableDetected && tableBuffer ? tableBuffer : activeWebsockets[answerId]?.answerBuffer || answerBuffer);
    };
  };

  const handleStop = (answerId) => {
    const wsData = activeWebsockets[answerId];
    if (wsData?.ws) {
      wsData.ws.close();
      finalizeResponse(answerId, wsData.answerBuffer || '');
    }
  };

  const finalizeResponse = (answerId, answerBuffer, data = null, errorMessage = null) => {
    setChatHistory((prev) => {
      const updatedHistory = [...prev];
      const lastMessage = updatedHistory.find((item) => item.id === answerId);
      if (lastMessage && lastMessage.type === 'answer') {
        lastMessage.answer = answerBuffer + (data?.answer || data || '');
        lastMessage.sources = data?.sources || [];
        lastMessage.isStreaming = false;
      }
      return updatedHistory;
    });

    setActiveWebsockets((prev) => {
      const newWebsockets = { ...prev };
      delete newWebsockets[answerId];
      return newWebsockets;
    });

    if (errorMessage) setError(errorMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'question',
          text: `فایل: ${file.name}`,
          timestamp: new Date(),
          id: uuidv4(),
        },
      ]);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const scrollToTopOrBottom = () => {
    if (scrollDirection === 'up') {
      chatContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('fa-IR', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const shouldShowDate = (currentItem, prevItem) => {
    if (!prevItem) return true;
    const currentDate = new Date(currentItem.timestamp).toDateString();
    const prevDate = new Date(prevItem.timestamp).toDateString();
    return currentDate !== prevDate;
  };

  const hasTable = (content) => {
    if (typeof content !== 'string') return false;
    return content.includes('<table');
  };

  const preprocessHTML = (htmlContent) => {
    if (typeof htmlContent !== 'string') return '';
    return htmlContent.replace(/[\u200e\u200f]/g, '');
  };

  const extractRenderableHTML = (htmlContent) => {
    return [htmlContent];
  };

  const renderHTMLContent = (htmlContent) => {
    if (typeof htmlContent !== 'string') {
      console.error('Invalid HTML content:', htmlContent);
      return <span>خطا در نمایش محتوا</span>;
    }

    const processedHTML = preprocessHTML(htmlContent);
    const renderableParts = extractRenderableHTML(processedHTML);

    if (renderableParts.length === 0) {
      return null;
    }

    const tableStyles = `
<style>
table {
  width: 100%;
  min-width: 100%;
  border-collapse: collapse;
  margin: 0;
  font-size: 0.875rem;
  direction: rtl;
  border: 1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'};
}

th, td {
  padding: 0.75rem;
  text-align: center;
  border: 1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'};
}

th {
  background-color: ${isDarkMode ? '#374151' : '#F3F4F6'};
  font-weight: 600;
  color: ${isDarkMode ? '#D1D5DB' : '#374151'};
}

td {
  background-color: ${isDarkMode ? '#1F2937' : '#FFFFFF'};
  color: ${isDarkMode ? '#E5E7EB' : '#1F2937'};
}

tr:nth-child(even) td {
  background-color: ${isDarkMode ? '#2D3748' : '#F9FAFB'};
}

h2, h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: ${isDarkMode ? '#D1D5DB' : '#1F2937'};
  text-align: right;
}

p {
  margin: 0.5rem 0;
  color: ${isDarkMode ? '#E5E7EB' : '#1F2937'};
  text-align: right;
}

ul {
  list-style-type: disc;
  padding-right: 1.25rem;
  margin: 0.5rem 0;
}

li {
  margin-bottom: 0.25rem;
  color: ${isDarkMode ? '#E5E7EB' : '#1F2937'};
  text-align: right;
}
a {
  font-weight: bold;
  color: #1E90FF;
  text-decoration: underline;
}
a:hover {
  color: #104E8B;
}
/* استایل‌های مخصوص موبایل */
@media (max-width: 640px) {
  table {
    min-width: 0;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: ${isDarkMode ? '#4A5568 #2D3748' : '#A0AEC0 #E2E8F0'};
  }
}

/* استایل‌های اسکرول‌بار برای Webkit (Chrome, Safari) */
table::-webkit-scrollbar {
  height: 8px;
}

table::-webkit-scrollbar-track {
  background: ${isDarkMode ? '#2D3748' : '#E2E8F0'};
}

table::-webkit-scrollbar-thumb {
  background: ${isDarkMode ? '#4A5568' : '#A0AEC0'};
  border-radius: 4px;
}

table::-webkit-scrollbar-thumb:hover {
  background: ${isDarkMode ? '#718096' : '#7A8799'};
}
</style>
`;

    try {
      return renderableParts.map((part, index) => (
          <div key={index}>
            {parse(tableStyles + part, {
              replace: (domNode) => {
                if (domNode.type === 'tag') {
                  return domToReact([domNode]);
                }
              },
            })}
          </div>
      ));
    } catch (err) {
      console.error('Error parsing HTML:', err);
      return <span>خطا در نمایش محتوا</span>;
    }
  };

  return (
      <AnimatePresence>
        <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed inset-0 w-full h-full ${
                isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
            } border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 font-sans`}
        >
          <div
              className={`flex items-center justify-between p-4 sm:p-5 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              } border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10`}
          >
            <div className="flex items-center space-x-3">
              <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg sm:text-xl font-bold">چت با خان</h2>
            </div>
            <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <SettingsModal
              showSettingsModal={showSettingsModal}
              setShowSettingsModal={setShowSettingsModal}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              showScrollButtonByUser={showScrollButtonByUser}
              setShowScrollButtonByUser={setShowScrollButtonByUser}
          />

          <div
              className={`relative flex flex-col h-[calc(100%-128px)] ${
                  isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}
          >
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 p-4 sm:p-6">
              {chatHistory.length === 0 ? (
                  <div className="text-center p-6">
                    <div
                        className={`mb-4 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } text-lg font-medium`}
                    >
                      سوال خود را بپرسید تا گفتگو شروع شود
                    </div>
                    <SuggestedQuestions
                        onSubmit={handleSubmit}
                        isDarkMode={isDarkMode}
                    />
                  </div>
              ) : (
                  <>
                    {chatHistory.map((item, index) => {
                      const lastAnswerIndex = chatHistory
                          .slice()
                          .reverse()
                          .findIndex((i) => i.type === 'answer');
                      const lastAnswerPosition = lastAnswerIndex >= 0 ? chatHistory.length - 1 - lastAnswerIndex : -1;
                      const isLastAnswer = item.type === 'answer' && index === lastAnswerPosition;
                      const containsTable = item.type === 'answer' && hasTable(item.answer);

                      return (
                          <div key={item.id}>
                            {shouldShowDate(item, chatHistory[index - 1]) && (
                                <div
                                    className={`text-center text-sm my-4 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                          <span
                              className={`px-4 py-1 rounded-full ${
                                  isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}
                          >
                            {formatDate(item.timestamp)}
                          </span>
                                </div>
                            )}
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                className="transition-all duration-200"
                            >
                              {item.type === 'question' ? (
                                  <div className="flex justify-start">
                                    <div
                                        className={`max-w-[90%] p-3 sm:p-4 rounded-2xl shadow-md ${
                                            isDarkMode ? 'bg-[#2481CC] text-white' : 'bg-[#DCF8C6] text-gray-900'
                                        }`}
                                    >
                                      <p className="leading-relaxed text-sm sm:text-base">{item.text}</p>
                                      <span
                                          className={`text-xs block text-left mt-2 ${
                                              isDarkMode ? 'text-blue-200' : 'text-gray-500'
                                          }`}
                                      >
                                {formatTimestamp(item.timestamp)}
                              </span>
                                    </div>
                                  </div>
                              ) : (
                                  <div className="flex justify-end">
                                    <div
                                        className={`p-3 sm:p-4 rounded-2xl shadow-md ${
                                            containsTable ? 'w-full' : 'max-w-[90%]'
                                        } ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                <span
                                    className={`text-sm font-semibold ${
                                        isDarkMode ? 'text-blue-300' : 'text-blue-600'
                                    }`}
                                >
                                  خان
                                </span>
                                        <span
                                            className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                                        >
                                  {formatTimestamp(item.timestamp)}
                                </span>
                                      </div>
                                      <div className="leading-relaxed text-sm sm:text-base">
                                        {renderHTMLContent(item.answer)}
                                      </div>
                                      {item.sources && item.sources.length > 0 && (
                                          <div className="mt-3">
                                            <h3
                                                className={`text-sm font-semibold ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                } mb-2`}
                                            >
                                              منابع:
                                            </h3>
                                            <ul className="list-disc pl-5 space-y-2">
                                              {item.sources.map((source, sourceIndex) => (
                                                  <li key={sourceIndex} className="text-sm">
                                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>
                                                      {source.text}
                                                    </p>
                                                    <a
                                                        href={source.metadata.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                      منبع: {source.metadata.source}
                                                    </a>
                                                  </li>
                                              ))}
                                            </ul>
                                          </div>
                                      )}
                                      {isLastAnswer && activeWebsockets[item.id] && item.isStreaming && (
                                          <motion.div
                                              variants={typingVariants}
                                              initial="initial"
                                              animate="animate"
                                              className="flex items-center space-x-2 mt-2"
                                          >
                                            <div className="flex space-x-1">
                                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                                              <div
                                                  className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                                                  style={{ animationDelay: '0.2s' }}
                                              ></div>
                                              <div
                                                  className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                                                  style={{ animationDelay: '0.4s' }}
                                              ></div>
                                            </div>
                                          </motion.div>
                                      )}
                                    </div>
                                  </div>
                              )}
                            </motion.div>
                          </div>
                      );
                    })}
                  </>
              )}
              <div ref={chatEndRef} />
            </div>

            {showScrollButton && showScrollButtonByUser && (
                <button
                    onClick={scrollToTopOrBottom}
                    className={`fixed bottom-20 right-4 p-3 rounded-full shadow-lg transition-all duration-200 opacity-40 ${
                        isDarkMode
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-[#273c11] text-white hover:bg-[#0e1706]'
                    } z-20`}
                >
                  {scrollDirection === 'up' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                  ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                  )}
                </button>
            )}
          </div>

          <div
              className={`w-full max-w-3xl mx-auto flex items-center p-4 sm:p-5 border-t ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-200'
              } bg-opacity-80 backdrop-blur-sm sticky bottom-0`}
          >
            <button
                onClick={handleSubmit}
                disabled={!question.trim()}
                className={`p-2 rounded-full ${
                    !question.trim()
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-blue-500 dark:text-blue-400'
                }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="سوال خود را بپرسید..."
                className={`flex-1 p-3 sm:p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none overflow-y-auto custom-scrollbar ${
                    isDarkMode
                        ? 'bg-gray-800 text-white placeholder-gray-400'
                        : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-300 light'
                } transition-all duration-200`}
                style={{
                  minHeight: '40px',
                  maxHeight: '120px',
                  lineHeight: '1.5',
                }}
                rows={1}
            />
          </div>

          {selectedFile && (
              <div
                  className={`text-sm p-3 mx-4 mb-4 rounded-lg flex items-center justify-between ${
                      isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-gray-100'
                  }`}
              >
                <span>فایل: ${selectedFile.name}</span>
                <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 transition-colors"
                >
                  حذف
                </button>
              </div>
          )}

          {error && (
              <div
                  className={`text-sm p-3 mx-4 mb-4 rounded-lg ${
                      isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-500 bg-red-100'
                  }`}
              >
                {error}
              </div>
          )}
        </motion.div>
      </AnimatePresence>
  );
};

export default Chat;