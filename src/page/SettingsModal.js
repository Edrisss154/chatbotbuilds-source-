import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const settingsModalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: 'easeIn' } },
};

const SettingsModal = ({
                           showSettingsModal,
                           setShowSettingsModal,
                           isDarkMode,
                           setIsDarkMode,
                           showScrollButtonByUser,
                           setShowScrollButtonByUser,
                       }) => {
    const handleOpenNewTab = () => {
        window.open('http://chat.satia.co/', '_blank');
        setShowSettingsModal(false);
    };

    return (
        <AnimatePresence>
            {showSettingsModal && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSettingsModal(false)}
                >
                    <motion.div
                        variants={settingsModalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${
                            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">تنظیمات</h3>
                            <button
                                onClick={() => setShowSettingsModal(false)}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2">تم</h4>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => {
                                        setIsDarkMode(false);
                                        setShowSettingsModal(false);
                                    }}
                                    className={`flex-1 p-2 rounded-lg transition-colors ${
                                        !isDarkMode
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300'
                                    }`}
                                >
                                    روشن
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDarkMode(true);
                                        setShowSettingsModal(false);
                                    }}
                                    className={`flex-1 p-2 rounded-lg transition-colors ${
                                        isDarkMode
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300'
                                    }`}
                                >
                                    تیره
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2">دکمه اسکرول</h4>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => {
                                        setShowScrollButtonByUser(true);
                                        setShowSettingsModal(false);
                                    }}
                                    className={`flex-1 p-2 rounded-lg transition-colors ${
                                        showScrollButtonByUser
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300'
                                    }`}
                                >
                                    فعال
                                </button>
                                <button
                                    onClick={() => {
                                        setShowScrollButtonByUser(false);
                                        setShowSettingsModal(false);
                                    }}
                                    className={`flex-1 p-2 rounded-lg transition-colors ${
                                        !showScrollButtonByUser
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300'
                                    }`}
                                >
                                    غیرفعال
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-2">باز کردن در تب جدید</h4>
                            <button
                                onClick={handleOpenNewTab}
                                className={`w-full p-2 rounded-lg transition-colors ${
                                    'bg-blue-500 text-white'
                                }`}
                            >
                                باز کردن
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;