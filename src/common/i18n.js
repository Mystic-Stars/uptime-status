export const languages = {
  'zh-CN': {
    name: '简体中文',
    text: {
      status: {
        ok: '正常',
        down: '无法访问',
        unknow: '未知'
      },
      monitor: {
        days: '天',
        hour: '小时',
        minute: '分',
        second: '秒',
        times: '次',
        nodata: '无数据',
        uptime: '可用率',
        down: '故障',
        total: '累计',
        average: '平均可用率',
        recent: '最近',
        today: '今天',
        group: '分组',
        averageUptime: '平均可用率',
        expand: '展开分组',
        collapse: '折叠分组',
        sites: '个站点'
      },
      footer: {
        powered: '提供监控服务',
        interval: '每 5 分钟检测一次',
        made: 'Made with ❤️ by'
      },
      themeToggle: '切换主题',
      languageToggle: '切换语言',
      search: {
        placeholder: '搜索站点名称或网址...',
        label: '搜索站点',
        clear: '清除搜索',
        noResults: '未找到匹配的站点',
        searching: '正在搜索...',
        tryAdjusting: '请尝试调整您的搜索条件',
        currentFilters: '当前筛选条件：',
        groupFilter: '分组',
        statusFilter: '状态',
        keyword: '搜索关键词',
        inGroup: '在分组',
        withStatus: '状态为',
        noFilters: '无筛选条件',
        tryAdjusting: '请尝试调整筛选条件后重试'
      },
      notice: {
        hideToday: '今天不再提示',
        close: '关闭'
      },
      filter: {
        allGroups: '所有分组',
        allStatus: '所有状态',
        groupLabel: '选择分组',
        statusLabel: '选择状态',
        clearAll: '清除筛选',
        shareFilters: '分享筛选结果',
        filtersApplied: '已应用筛选'
      },
      statistics: {
        total: '监控站点',
        operational: '正常运行',
        down: '故障站点',
        unknown: '未知状态',
        uptime: '平均可用率'
      }
    }
  },
  'en-US': {
    name: 'English',
    text: {
      status: {
        ok: 'Operational',
        down: 'Down',
        unknow: 'Unknown'
      },
      monitor: {
        days: 'days',
        hour: 'hours',
        minute: 'minutes',
        second: 'seconds',
        times: 'times',
        nodata: 'No Data',
        uptime: 'Uptime',
        down: 'Down',
        total: 'Total',
        average: 'Average Uptime',
        recent: 'Last',
        today: 'Today',
        group: 'Group',
        averageUptime: 'Average Uptime',
        expand: 'Expand Group',
        collapse: 'Collapse Group',
        sites: 'sites'
      },
      footer: {
        powered: 'Powered by',
        interval: 'Checked every 5 minutes',
        made: 'Made with ❤️ by'
      },
      themeToggle: 'Toggle Theme',
      languageToggle: 'Switch Language',
      search: {
        placeholder: 'Search sites by name or URL...',
        label: 'Search sites',
        clear: 'Clear search',
        noResults: 'No matching sites found',
        searching: 'Searching...',
        tryAdjusting: 'Try adjusting your search term',
        currentFilters: 'Current filters:',
        groupFilter: 'Group',
        statusFilter: 'Status',
        keyword: 'Search keyword',
        inGroup: 'In group',
        withStatus: 'With status',
        noFilters: 'No filters applied',
        tryAdjusting: 'Try adjusting your filters and try again'
      },
      notice: {
        hideToday: 'Hide for today',
        close: 'Close'
      },
      filter: {
        allGroups: 'All Groups',
        allStatus: 'All Status',
        groupLabel: 'Select Group',
        statusLabel: 'Select Status',
        clearAll: 'Clear Filters',
        filtersApplied: 'Filters Applied'
      },
      statistics: {
        total: 'Total Sites',
        operational: 'Operational',
        down: 'Down',
        unknown: 'Unknown',
        uptime: 'Average Uptime'
      }
    }
  }
};

// 获取浏览器默认语言
function getBrowserLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  // 如果是中文环境返回zh-CN，否则返回en-US
  return lang.startsWith('zh') ? 'zh-CN' : 'en-US';
}

export const defaultLocale = getBrowserLanguage();

export function getLocale() {
  // 优先使用本地存储的语言设置
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale && languages[savedLocale]) {
    return savedLocale;
  }
  
  // 如果没有本地设置，使用浏览器语言
  const browserLocale = getBrowserLanguage();
  localStorage.setItem('locale', browserLocale);
  return browserLocale;
}

export function getText(key) {
  const locale = getLocale();
  const keys = key.split('.');
  let text = languages[locale].text;
  
  for (const k of keys) {
    text = text[k];
    if (!text) return key;
  }
  
  return text;
} 