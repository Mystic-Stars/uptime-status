import { useState, useRef, useEffect } from 'react';
import { getText, getLocale } from '../common/i18n';

function FilterDropdown({ type, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const locale = getLocale();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayText = () => {
    if (type === 'group') {
      if (!value) return getText('filter.allGroups');
      const group = options.find(g => g.id === value);
      return group ? (group.name[locale] || group.name['en-US']) : getText('filter.allGroups');
    } else if (type === 'status') {
      if (!value) return getText('filter.allStatus');
      return getText(`status.${value}`);
    }
    return '';
  };

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="filter-text">{getDisplayText()}</span>
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
        <div 
          className="filter-options" 
          role="listbox"
          aria-label={getText(`filter.${type}Label`)}
        >
          <button
            className={`filter-option ${!value ? 'active' : ''}`}
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
            role="option"
            aria-selected={!value}
          >
            {type === 'group' ? getText('filter.allGroups') : getText('filter.allStatus')}
          </button>
          {options.map((option) => (
            <button
              key={type === 'group' ? option.id : option}
              className={`filter-option ${value === (type === 'group' ? option.id : option) ? 'active' : ''}`}
              onClick={() => {
                onChange(type === 'group' ? option.id : option);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === (type === 'group' ? option.id : option)}
            >
              {type === 'group' 
                ? (option.name[locale] || option.name['en-US'])
                : getText(`status.${option}`)
              }
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
