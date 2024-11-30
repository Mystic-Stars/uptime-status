// 从站点名称中提取序号
export function extractSiteNumber(name) {
  const match = name.match(/^(\d+)\./);
  return match ? parseInt(match[1]) : Infinity;
}

// 从站点名称中提取清洁的名称（去除序号）
export function cleanSiteName(name) {
  return name.replace(/^\d+\.\s*/, '').trim();
}

// 对监控站点进行分组
export function groupMonitors(monitors) {
  const { EnableGroups, SiteGroups, DefaultGroup } = window.Config;
  
  // 如果未启用分组功能，将所有站点放在默认分组中
  if (!EnableGroups) {
    return {
      'all': {
        id: 'all',
        name: { 'zh-CN': '全部', 'en-US': 'All' },
        monitors: [...monitors].sort((a, b) => 
          extractSiteNumber(a.name) - extractSiteNumber(b.name)
        )
      }
    };
  }

  const groups = {};
  
  // 首先按序号排序
  const sortedMonitors = [...monitors].sort((a, b) => 
    extractSiteNumber(a.name) - extractSiteNumber(b.name)
  );
  
  // 创建分组映射
  const siteGroupMap = {};
  if (SiteGroups) {
    SiteGroups.forEach(group => {
      groups[group.id] = {
        ...group,
        monitors: []
      };
      group.sites.forEach(siteNumber => {
        siteGroupMap[siteNumber] = group.id;
      });
    });
  }
  
  // 分配站点到对应分组
  sortedMonitors.forEach(monitor => {
    const siteNumber = extractSiteNumber(monitor.name);
    const groupId = siteGroupMap[siteNumber];
    
    if (groupId && groups[groupId]) {
      groups[groupId].monitors.push(monitor);
    } else {
      // 未分组的站点放入默认分组
      if (!groups['default']) {
        groups['default'] = {
          id: 'default',
          name: DefaultGroup || { 'zh-CN': '其他', 'en-US': 'Others' },
          monitors: []
        };
      }
      groups['default'].monitors.push(monitor);
    }
  });
  
  // 移除空分组
  Object.keys(groups).forEach(key => {
    if (groups[key].monitors.length === 0) {
      delete groups[key];
    }
  });
  
  // 只按配置顺序排序
  const sortedGroups = {};
  Object.entries(groups)
    .sort(([, a], [, b]) => {
      // 默认分组永远在最后
      if (a.id === 'default') return 1;
      if (b.id === 'default') return -1;
      
      // 按配置中的顺序排序
      const aIndex = SiteGroups?.findIndex(g => g.id === a.id) ?? Infinity;
      const bIndex = SiteGroups?.findIndex(g => g.id === b.id) ?? Infinity;
      return aIndex - bIndex;
    })
    .forEach(([key, value]) => {
      sortedGroups[key] = value;
    });
  
  return sortedGroups;
} 