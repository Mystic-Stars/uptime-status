import { useMemo } from 'react';
import Link from './link';
import Header from './header';
import UptimeRobot from './uptimerobot';
import Package from '../../package.json';

function App() {

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
        <div id='uptime'>
          {apikeys.map((key) => (
            <UptimeRobot key={key} apikey={key} />
          ))}
        </div>
        <div id='footer'>
          <p>
            <Link to='https://uptimerobot.com/' text='UptimeRobot' /> 提供监控服务 | 
            每 5 分钟检测一次
          </p>
          <p>
            Made with ❤️ by <Link to='https://www.ghs.red' text='Garbage Human Studio' /> | 
            Version {Package.version}
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
