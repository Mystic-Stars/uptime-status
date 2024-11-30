import { getText, getLocale } from '../common/i18n';

function NoResults({ searchTerm, groupFilter, statusFilter }) {
  const locale = getLocale();

  // 获取筛选条件的显示文本
  const getFilterText = () => {
    const filters = [];
    
    if (searchTerm) {
      filters.push(`${getText('search.keyword')}: "${searchTerm}"`);
    }
    
    if (groupFilter) {
      const group = window.Config.SiteGroups.find(g => g.id === groupFilter);
      if (group) {
        const groupName = group.name[locale] || group.name['en-US'];
        filters.push(`${getText('search.inGroup')} "${groupName}"`);
      }
    }
    
    if (statusFilter) {
      filters.push(`${getText('search.withStatus')} "${getText(`status.${statusFilter}`)}"`)
    }

    if (filters.length === 0) {
      return getText('search.noFilters');
    }

    return filters.join('，');
  };

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
        <div className="search-filters">
          {getFilterText()}
        </div>
      </div>
    </div>
  );
}

export default NoResults; 