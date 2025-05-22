import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWizards } from './api'; // تابع جدید را وارد کنید

const suggestionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
            staggerChildren: 0.1,
        },
    },
};

const suggestionItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

const SuggestedQuestions = ({ onSubmit, isDarkMode }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadWizards = async () => {
            try {
                const wizards = await fetchWizards();
                // فرض می‌کنیم API آرایه‌ای از اشیا با فیلد title برمی‌گرداند
                const suggestionTitles = wizards
                    .filter((wizard) => wizard.enabled) // فقط ویزارد‌های فعال
                    .map((wizard) => wizard.title);
                setSuggestions(suggestionTitles);
            } catch (err) {
                console.error('Error loading wizards:', err);
                setError('خطا در دریافت سوالات پیشنهادی');
            }
        };
        loadWizards();
    }, []);

    return (
        <motion.div
            variants={suggestionVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-3 p-4"
        >
            {error && (
                <div className={`text-sm p-3 rounded-lg ${isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-500 bg-red-100'}`}>
                    {error}
                </div>
            )}
            {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                    <motion.button
                        key={index}
                        variants={suggestionItemVariants}
                        onClick={() => {
                            const fakeEvent = { preventDefault: () => {} };
                            onSubmit(fakeEvent, suggestion);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isDarkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        {suggestion}
                    </motion.button>
                ))
            ) : (
                !error && (
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        در حال بارگذاری سوالات پیشنهادی...
                    </div>
                )
            )}
        </motion.div>
    );
};

export default SuggestedQuestions;