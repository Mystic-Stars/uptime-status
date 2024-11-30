import { useState, useRef, useEffect } from 'react';
import { languages, getLocale } from '../common/i18n';

function LanguageToggle() {
  const [currentLocale, setCurrentLocale] = useState(getLocale());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const countryCode = {
    'zh-CN': 'cn',
    'en-US': 'us'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (locale) => {
    setCurrentLocale(locale);
    localStorage.setItem('locale', locale);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button 
        className="language-toggle-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="切换语言"
      >
        <span className={`fi fi-${countryCode[currentLocale]}`}></span>
        <span className="language-name">{languages[currentLocale].name}</span>
        <svg 
          className={`arrow-icon ${isOpen ? 'open' : ''}`} 
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path 
            d="M2.5 4.5L6 8L9.5 4.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              className={`language-option ${code === currentLocale ? 'active' : ''}`}
              onClick={() => handleSelect(code)}
            >
              <span className={`fi fi-${countryCode[code]}`}></span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageToggle; 