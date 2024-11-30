import { getText } from '../common/i18n';

function NoResults({ searchTerm }) {
  return (
    <div className="no-results">
      <svg 
        width="48" 
        height="48" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M8 11h6" />
      </svg>
      <div className="no-results-text">
        <p className="primary-text">{getText('search.noResults')}</p>
        <p className="secondary-text">
          {getText('search.tryAdjusting')}
        </p>
        <div className="search-term">
          "{searchTerm}"
        </div>
      </div>
    </div>
  );
}

export default NoResults; 