# Uptime Next Status

一个基于 [UptimeRobot](https://uptimerobot.com/) API 的在线状态面板，用于展示网站监控状态。本项目基于 [yb/uptime-status](https://github.com/yb/uptime-status) 开发。

![预览图](https://bu.dusays.com/2024/11/23/6741e9e45efc5.png)

## 特性

- 🎯 支持多个监控站点
- 🌓 支持亮色/暗色主题切换
- 📱 完美适配移动端
- 🔧 配置简单，开箱即用
- 🎨 界面美观，动画流畅
- ⚡ 访问速度快，无需后端

## 使用方法

### 事先准备

1. 在 [UptimeRobot](https://uptimerobot.com/) 添加站点监控
2. 在 UptimeRobot 的 My Settings 页面获取 API Key
3. 准备一个网站空间（支持 Nginx、PHP 等环境，也可以是阿里云 OSS 等纯静态空间）

### 部署步骤

1. 从 [Releases](https://github.com/Mystic-Stars/uptime-status/releases) 下载最新版本
2. 修改 `config.js` 文件：
   ```js
   window.Config = {
   
     // 站点标题
     SiteName: '网站名字',
   
     // UptimeRobot API Keys
     ApiKeys: [
       'ur27xxx33-b4xxxxxxxxxxxxdee6763',
     ],
   
     // 监控天数（推荐60-90）
     CountDays: 60,
   
     // 是否显示检测站点的链接
     ShowLink: true,
   
     // 导航栏菜单
     Navi: [
       {
         text: '网站名称',
         url: 'https://www.example.com'
       },    
     ],
   };
   ```
3. 将所有文件上传到网站空间

### 接口代理（可选）

如需自行搭建接口代理，可参考以下 Nginx 配置：

```nginx
server {
  listen [::]:80;
  server_name your-domain.com;
  
  location / {
    proxy_ssl_server_name on;
    proxy_pass https://api.uptimerobot.com/;
    proxy_hide_header Access-Control-Allow-Origin;
    add_header Access-Control-Allow-Origin * always;
  }
}
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm start

# 构建
npm run build
```

## 致谢

- [yb/uptime-status](https://github.com/yb/uptime-status) - 原项目作者
- [UptimeRobot](https://uptimerobot.com/) - 提供监控服务

## 许可证

[MIT License](https://github.com/Mystic-Stars/uptime-status/blob/main/LICENSE)
