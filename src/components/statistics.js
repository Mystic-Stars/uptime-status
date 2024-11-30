import { getText } from '../common/i18n';

function Statistics({ monitors }) {
  if (!monitors) return null;

  const stats = monitors.reduce((acc, site) => {
    acc.total++;
    if (site.status === 'ok') acc.operational++;
    if (site.status === 'down') acc.down++;
    acc.averageUptime += parseFloat(site.average);
    return acc;
  }, { total: 0, operational: 0, down: 0, averageUptime: 0 });

  stats.averageUptime = (stats.averageUptime / stats.total).toFixed(2);
  stats.unknown = stats.total - stats.operational - stats.down;

  return (
    <div className="site-statistics">
      <div className="stat-item">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">{getText('statistics.total')}</span>
      </div>
      <div className="stat-item operational">
        <span className="stat-value">{stats.operational}</span>
        <span className="stat-label">{getText('statistics.operational')}</span>
      </div>
      {stats.down > 0 && (
        <div className="stat-item down">
          <span className="stat-value">{stats.down}</span>
          <span className="stat-label">{getText('statistics.down')}</span>
        </div>
      )}
      {stats.unknown > 0 && (
        <div className="stat-item unknown">
          <span className="stat-value">{stats.unknown}</span>
          <span className="stat-label">{getText('statistics.unknown')}</span>
        </div>
      )}
      <div className="stat-item uptime">
        <span className="stat-value">{stats.averageUptime}%</span>
        <span className="stat-label">{getText('statistics.uptime')}</span>
      </div>
    </div>
  );
}

export default Statistics; 