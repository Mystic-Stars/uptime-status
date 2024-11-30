import ReactTooltip from 'react-tooltip';
import { useEffect, useState } from 'react';
import { GetMonitors } from '../common/uptimerobot';
import { formatDuration, formatNumber } from '../common/helper';
import { getText } from '../common/i18n';
import Link from './link';
import HighlightText from './highlight-text';
import NoResults from './no-results';

function UptimeRobot({ apikey, searchTerm }) {

  const status = {
    ok: getText('status.ok'),
    down: getText('status.down'),
    unknow: getText('status.unknow')
  };

  const { CountDays, ShowLink } = window.Config;

  const [monitors, setMonitors] = useState();

  const formatSiteName = (name) => {
    return name.replace(/^\d+\.\s*/, '');
  };

  useEffect(() => {
    GetMonitors(apikey, CountDays).then(setMonitors);
  }, [apikey, CountDays]);

  if (monitors) {
    const filteredMonitors = monitors.filter(site => 
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (searchTerm && filteredMonitors.length === 0) {
      return <NoResults searchTerm={searchTerm} />;
    }

    return filteredMonitors.map((site) => (
      <div key={site.id} className='site'>
        <div className='meta'>
          <span className='name'>
            <HighlightText 
              text={formatSiteName(site.name)} 
              highlight={searchTerm}
            />
          </span>
          {ShowLink && (
            <Link 
              className='link' 
              to={site.url} 
              text={
                <HighlightText 
                  text={site.url} 
                  highlight={searchTerm}
                />
              } 
            />
          )}
          <span className={'status ' + site.status}>{status[site.status]}</span>
        </div>
        <div className='timeline'>
          {site.daily.slice().reverse().map((data, index) => {
            let status = '';
            let text = data.date.format('YYYY-MM-DD ');
            if (data.uptime >= 100) {
              status = 'ok';
              text += `${getText('monitor.uptime')} ${formatNumber(data.uptime)}%`;
            }
            else if (data.uptime <= 0 && data.down.times === 0) {
              status = 'none';
              text += getText('monitor.nodata');
            }
            else {
              status = 'down';
              text += `${getText('monitor.down')} ${data.down.times} ${getText('monitor.times')}，${getText('monitor.total')} ${formatDuration(data.down.duration)}，${getText('monitor.uptime')} ${formatNumber(data.uptime)}%`;
            }
            return (<i key={index} className={status} data-tip={text} />)
          })}
        </div>
        <div className='summary'>
          <span>{site.daily[site.daily.length - 1].date.format('YYYY-MM-DD')}</span>
          <div className="stats-group">
            <div className="average-uptime">
              <span className="label">{getText('monitor.average')}</span>
              <span className="value">{site.average}%</span>
            </div>
            <span className="time-range">
              {site.total.times
                ? `${getText('monitor.recent')} ${CountDays} ${getText('monitor.days')}${getText('monitor.down')} ${site.total.times} ${getText('monitor.times')}，${getText('monitor.total')} ${formatDuration(site.total.duration)}`
                : `${getText('monitor.recent')} ${CountDays} ${getText('monitor.days')}`}
            </span>
          </div>
          <span>{getText('monitor.today')}</span>
        </div>
        <ReactTooltip className='tooltip' place='top' type='dark' effect='solid' />
      </div>
    ));
  }

  else return (
    <div className='site'>
      <div className='loading' />
    </div>
  );
}

export default UptimeRobot;
