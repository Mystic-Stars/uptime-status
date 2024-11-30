window.Config = {

  // 站点标题
  SiteName: 'GHS Status',

  // 站点图标
  Logo: {
    // 图标图片URL
    icon: 'favicon.ico',
    // 图标大小
    width: '28px',
    height: '28px'
  },

  // UptimeRobot API Keys
  ApiKeys: [
    'ur2716233-b4bfa6c94f221c3addee6763',
  ],

  // 监控天数
  CountDays: 60,

  // 是否显示检测站点的链接
  ShowLink: true,

  // 导航栏菜单
  Navi: [
    {
      'zh-CN': {
        text: '官方网站'
      },
      'en-US': {
        text: 'Official Website'
      },
      url: 'https://www.ghs.red'
    },    
    {
      'zh-CN': {
        text: 'GitHub'
      },
      'en-US': {
        text: 'GitHub'
      },
      url: 'https://github.com/GarbageHumanStudio'
    },
    {
      'zh-CN': {
        text: '开发博客'
      },
      'en-US': {
        text: 'Dev Blog'
      },
      url: 'https://www.mysticstars.cn'
    },
  ],

  // 网站公告
  Notice: {
    enable: true,
    type: 'success', // 公告类型: info(信息) | warning(警告) | success(成功) | error(错误)
    priority: false, // 是否为高优先级公告（不可关闭）
    text: {
      'zh-CN': '欢迎来到GHS Status！所有服务正常运行中……',
      'en-US': 'Welcome to GHS Status! All services are operational……'
    }
  },

  // 是否启用分组功能
  EnableGroups: true,

  // 站点分组配置
  SiteGroups: [
    {
      id: 1,
      name: {
        'zh-CN': '官方网站',
        'en-US': 'Official Sites'
      },
      sites: [1, 3] // 使用站点序号定义分组包含的站点
    },
    {
      id: 2,
      name: {
        'zh-CN': '开发环境',
        'en-US': 'Development'
      },
      sites: [4, 2]
    },
    {
      id: 3,
      name: {
        'zh-CN': '生产环境',
        'en-US': 'Production'
      },
      sites: [7, 8, 9]
    }
  ],

  // 未分组的站点将显示在此分组
  DefaultGroup: {
    'zh-CN': '其他',
    'en-US': 'Others'
  }
};
