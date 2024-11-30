import { useMemo, useState, useEffect } from 'react';
import Link from './link';
import Header from './header';
import Notice from './notice';
import UptimeRobot from './uptimerobot';
import LanguageToggle from './language-toggle';
import SearchBar from './search-bar';
import { getText } from '../common/i18n';
import Package from '../../package.json';
import Statistics from './statistics';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [monitors, setMonitors] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const group = params.get('group');
    const status = params.get('status');

    if (search) setSearchTerm(search);
    if (group) setGroupFilter(parseInt(group));
    if (status) setStatusFilter(status);
  }, []);

  const updateURL = (search, group, status) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (group) params.set('group', group);
    if (status) params.set('status', status);

    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newURL);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    updateURL(term, groupFilter, statusFilter);
  };

  const handleGroupFilter = (group) => {
    setGroupFilter(group);
    updateURL(searchTerm, group, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    updateURL(searchTerm, groupFilter, status);
  };

  const apikeys = useMemo(() => {
    const { ApiKeys } = window.Config;
    if (Array.isArray(ApiKeys)) return ApiKeys;
    if (typeof ApiKeys === 'string') return [ApiKeys];
    return [];
  }, []);

  return (
    <>
      <Header />
      <Notice />
      <div className='container'>
        <div className="search-filter-container">
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          <div className="filters-container">
            <UptimeRobot.Filters
              groupFilter={groupFilter}
              statusFilter={statusFilter}
              onGroupFilterChange={handleGroupFilter}
              onStatusFilterChange={handleStatusFilter}
            />
          </div>
        </div>
        <div id='uptime'>
          {apikeys.map((key) => (
            <UptimeRobot 
              key={key} 
              apikey={key} 
              searchTerm={searchTerm}
              groupFilter={groupFilter}
              statusFilter={statusFilter}
              onMonitorsLoad={(monitors) => setMonitors(monitors)}
            />
          ))}
        </div>
        <div id='footer'>
          <Statistics monitors={monitors} />
          <p>
            <Link to='https://uptimerobot.com/' text='UptimeRobot' /> {getText('footer.powered')} | 
            {getText('footer.interval')}
          </p>
          <p>
            {getText('footer.made')} <Link to='https://www.ghs.red' text='Garbage Human Studio' /> | 
            Version {Package.version}
          </p>
          <LanguageToggle />
        </div>
      </div>
    </>
  );
}

export default App;
