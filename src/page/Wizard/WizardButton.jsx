import { useState } from "react";

const WizardButton = ({ wizard, onWizardClick }) => {
    const [error, setError] = useState(null);

    const handleWizardClick = async (wizardId) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/wizards/${wizardId}?enable_only=true`);
          if (!response.ok) {
            throw new Error('خطا در دریافت محتوای ویزارد');
          }
          const data = await response.json();
          onWizardClick(data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <button
            key={wizard.id}
            onClick={() => {handleWizardClick(wizard.id)}}
            className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-full hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md"
        >
            {wizard.title}
        </button>
    )
}

export default WizardButton;