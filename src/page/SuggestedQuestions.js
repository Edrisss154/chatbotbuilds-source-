import React from 'react';
import { motion } from 'framer-motion';

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
    const suggestions = [
        'درباره ساتیا توضیح بده',
        'تعرفه اینترنت ساتیا؟',
        'تعرفه adsl؟',
        'تعرفه نصب انتن؟',
        '  تعرفه لاله یک؟',

    ];

    return (
        <motion.div
            variants={suggestionVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-3 p-4"
        >
            {suggestions.map((suggestion, index) => (
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
            ))}
        </motion.div>
    );
};

export default SuggestedQuestions;