import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 border rounded-xl dark:bg-gray-800 dark:border-gray-700">
      <button
        onClick={() => toggleLanguage('uk')}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 ${
          i18n.language === 'uk'
            ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        UK
      </button>
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 ${
          i18n.language === 'en'
            ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  );
}