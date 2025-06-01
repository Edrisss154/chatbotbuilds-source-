import React from 'react';
import WizardButton from './WizardButton';

const WizardButtons = ({ wizards, onWizardSelect, rootWizards, setCurrentWizards }) => {
    if (!wizards || wizards.length === 0) {
        return (
            <div className="text-gray-500 dark:text-gray-400 text-sm text-center p-4">
                هیچ ویزارد فعالی یافت نشد
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2 py-3">
            {wizards.map((wizard) => (
                <WizardButton key={wizard.id} wizard={wizard} onWizardClick={onWizardSelect} />
            ))}
            {wizards !== rootWizards && (
                <button 
                    onClick={() => setCurrentWizards(rootWizards)}
                    className="px-4 py-2 text-sm font-medium rounded-full transition-colors shadow-md backdrop-filter backdrop-blur-sm bg-gray-200/30 hover:bg-gray-300/50 dark:bg-gray-700/30 dark:hover:bg-gray-600/50 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                >
                    بازگشت
                </button>
            )}
        </div>
    );
};

export default WizardButtons;