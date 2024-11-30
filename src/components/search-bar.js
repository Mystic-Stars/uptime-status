import { useState } from 'react';
import { getText } from '../common/i18n';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={getText('search.placeholder')}
        aria-label={getText('search.label')}
      />
      {searchTerm && (
        <button 
          className="clear-button" 
          onClick={() => {
            setSearchTerm('');
            onSearch('');
          }}
          aria-label={getText('search.clear')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar; 