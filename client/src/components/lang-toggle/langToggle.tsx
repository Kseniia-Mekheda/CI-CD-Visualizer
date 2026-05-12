import { useTranslation } from 'react-i18next';

function isLangActive(current: string, code: 'uk' | 'en') {
  const base = (current || '').split('-')[0]?.toLowerCase();
  return base === code;
}

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const lng = i18n.resolvedLanguage || i18n.language || 'uk';

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-xl border border-light-border bg-light-panel p-1 shadow-sm"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        aria-pressed={isLangActive(lng, 'uk')}
        onClick={() => i18n.changeLanguage('uk')}
        className={`min-w-[2.75rem] rounded-lg px-2.5 py-1.5 text-xs font-bold tracking-wide transition-all ${
          isLangActive(lng, 'uk')
            ? 'bg-white text-accent shadow-sm ring-1 ring-light-border/80'
            : 'text-light-text-muted hover:bg-white/70 hover:text-light-text'
        }`}
      >
        Укр
      </button>
      <button
        type="button"
        aria-pressed={isLangActive(lng, 'en')}
        onClick={() => i18n.changeLanguage('en')}
        className={`min-w-[2.75rem] rounded-lg px-2.5 py-1.5 text-xs font-bold tracking-wide transition-all ${
          isLangActive(lng, 'en')
            ? 'bg-white text-accent shadow-sm ring-1 ring-light-border/80'
            : 'text-light-text-muted hover:bg-white/70 hover:text-light-text'
        }`}
      >
        EN
      </button>
    </div>
  );
}
