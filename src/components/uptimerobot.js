import ReactTooltip from 'react-tooltip';
import { useEffect, useState } from 'react';
import { GetMonitors } from '../common/uptimerobot';
import { formatDuration, formatNumber } from '../common/helper';
import { getText, getLocale } from '../common/i18n';
import { groupMonitors, cleanSiteName } from '../common/groupHelper';
import Link from './link';
import HighlightText from './highlight-text';
import NoResults from './no-results';
import FilterDropdown from './filter-dropdown';
import Skeleton from './skeleton';
import Statistics from './statistics';

const STATUS = {
  ok: getText('status.ok'),
  down: getText('status.down'),
  unknow: getText('status.unknow')
};

// 新增筛选器组件
function Filters({ groupFilter, statusFilter, onGroupFilterChange, onStatusFilterChange }) {
  const hasFilters = groupFilter || statusFilter;

  const clearAllFilters = () => {
    onGroupFilterChange(null);
    onStatusFilterChange(null);
  };

  return (
    <>
      <FilterDropdown
        type="group"
        options={window.Config.SiteGroups}
        value={groupFilter}
        onChange={onGroupFilterChange}
      />
      <FilterDropdown
        type="status"
        options={['ok', 'down', 'unknow']}
        value={statusFilter}
        onChange={onStatusFilterChange}
      />
      {hasFilters && (
        <button 
          className="clear-filters-btn"
          onClick={clearAllFilters}
          aria-label={getText('filter.clearAll')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" 
              fill="currentColor"/>
          </svg>
          <span>{getText('filter.clearAll')}</span>
        </button>
      )}
    </>
  );
}

function UptimeRobot({ apikey, searchTerm, groupFilter, statusFilter, onMonitorsLoad }) {
  const { CountDays, ShowLink, EnableGroups } = window.Config;
  const [monitors, setMonitors] = useState();
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const locale = getLocale();

  useEffect(() => {
    GetMonitors(apikey, CountDays).then(data => {
      setMonitors(data);
      if (onMonitorsLoad) onMonitorsLoad(data);
    });
  }, [apikey, CountDays, onMonitorsLoad]);

  // 从本地存储加载折叠状态
  useEffect(() => {
    const saved = localStorage.getItem('collapsedGroups');
    if (saved) {
      setCollapsedGroups(new Set(JSON.parse(saved)));
    }
  }, []);

  // 添加滚动检测
  useEffect(() => {
    const handleScroll = () => {
      const headers = document.querySelectorAll('.group-header');
      headers.forEach(header => {
        const rect = header.getBoundingClientRect();
        if (rect.top <= 72) {
          header.classList.add('sticky');
        } else {
          header.classList.remove('sticky');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      localStorage.setItem('collapsedGroups', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const renderGroups = (groups) => {
    return Object.values(groups).map((group) => (
      <div 
        key={group.id} 
        className={`monitor-group ${!EnableGroups ? 'no-group-style' : ''}`}
        role="region" 
        aria-label={group.name[locale] || group.name['en-US']}
      >
        {EnableGroups && (
          <div className="group-header">
            <div className="group-title-wrapper">
              <button 
                className={`group-collapse-btn ${collapsedGroups.has(group.id) ? 'collapsed' : ''}`}
                onClick={() => toggleGroup(group.id)}
                aria-expanded={!collapsedGroups.has(group.id)}
                aria-controls={`group-content-${group.id}`}
                aria-label={
                  collapsedGroups.has(group.id) 
                    ? `${getText('monitor.expand')} ${group.name[locale]}`
                    : `${getText('monitor.collapse')} ${group.name[locale]}`
                }
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="16" 
                  height="16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <h2 className="group-title" id={`group-heading-${group.id}`}>
                {group.name[locale] || group.name['en-US']}
                <span className="group-count" aria-label={`${group.monitors.length} ${getText('monitor.sites')}`}>
                  ({group.monitors.length})
                </span>
              </h2>
            </div>
            <div className="group-stats">
              <span className="group-uptime">
                {getText('monitor.averageUptime')}: {
                  formatNumber(
                    group.monitors.reduce((sum, site) => sum + parseFloat(site.average), 0) / group.monitors.length
                  )
                }%
              </span>
            </div>
          </div>
        )}
        <div 
          id={`group-content-${group.id}`}
          className={`group-content ${collapsedGroups.has(group.id) ? 'collapsed' : ''}`}
          aria-labelledby={`group-heading-${group.id}`}
          role="region"
          aria-hidden={collapsedGroups.has(group.id)}
        >
          {group.monitors.map((site) => (
            <div 
              key={site.id} 
              className='site'
              role="article"
              aria-labelledby={`site-name-${site.id}`}
            >
              <div className='meta'>
                <span className='name' id={`site-name-${site.id}`}>
                  <HighlightText 
                    text={cleanSiteName(site.name)} 
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
                <span className={'status ' + site.status}>{STATUS[site.status]}</span>
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
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // 渲染筛选器
  const renderFilters = () => (
    <Filters
      groupFilter={groupFilter}
      statusFilter={statusFilter}
      onGroupFilterChange={setGroupFilter}
      onStatusFilterChange={setStatusFilter}
    />
  );

  if (monitors) {
    // 首先应用搜索过滤
    let filteredMonitors = monitors.filter(site => 
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 应用状态过滤
    if (statusFilter) {
      filteredMonitors = filteredMonitors.filter(site => site.status === statusFilter);
    }

    const groups = groupMonitors(filteredMonitors);

    // 应用分组过滤
    let displayGroups = groups;
    if (groupFilter) {
      displayGroups = {};
      if (groups[groupFilter]) {
        displayGroups[groupFilter] = groups[groupFilter];
      }
    }

    // 检查是否有任何要显示的监控站点
    const hasMonitors = Object.values(displayGroups).some(group => group.monitors.length > 0);

    if (!hasMonitors) {
      return <NoResults 
        searchTerm={searchTerm} 
        groupFilter={groupFilter} 
        statusFilter={statusFilter}
      />;
    }

    return (
      <>
        {renderGroups(displayGroups)}
        <ReactTooltip className='tooltip' place='top' type='dark' effect='solid' />
      </>
    );
  }

  return <Skeleton />;
}

// 导出���选器组件和主组件
UptimeRobot.Filters = Filters;

export default UptimeRobot;
