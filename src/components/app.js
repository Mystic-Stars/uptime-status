import { useMemo, useState } from 'react';
import Link from './link';
import Header from './header';
import UptimeRobot from './uptimerobot';
import LanguageToggle from './language-toggle';
import SearchBar from './search-bar';
import { getText } from '../common/i18n';
import Package from '../../package.json';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const apikeys = useMemo(() => {
    const { ApiKeys } = window.Config;
    if (Array.isArray(ApiKeys)) return ApiKeys;
    if (typeof ApiKeys === 'string') return [ApiKeys];
    return [];
  }, []);

  return (
    <>
      <Header />
      <div className='container'>
        <SearchBar onSearch={setSearchTerm} />
        <div id='uptime'>
          {apikeys.map((key) => (
            <UptimeRobot key={key} apikey={key} searchTerm={searchTerm} />
          ))}
        </div>
        <div id='footer'>
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
