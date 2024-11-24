import { useEffect, useState } from 'react';
import Link from './link';

function Header() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = window.Config.SiteName;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setIsDark(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
      localStorage.setItem('theme', newTheme);
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const toggleDark = () => {
    const isDarkMode = !isDark;
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div id='header'>
      <div className='container'>
        <h1 className='logo'>{window.Config.SiteName}</h1>
        <div className='navi'>
          {/* 桌面端导航 */}
          <div className="desktop-nav">
            {window.Config.Navi.map((item, index) => (
              <Link key={index} to={item.url} text={item.text} />
            ))}
          </div>
          
          {/* 移动端汉堡按钮 */}
          <button className="hamburger" onClick={toggleMenu} aria-label="菜单">
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <button onClick={toggleDark} className="theme-toggle" title="切换主题">
            <svg className="sun" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="moon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        {window.Config.Navi.map((item, index) => (
          <Link key={index} to={item.url} text={item.text} />
        ))}
      </div>
    </div>
  );
}

export default Header;
