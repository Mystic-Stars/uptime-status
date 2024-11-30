import { useState, useEffect } from 'react';
import { getLocale, getText } from '../common/i18n';

// 预设样式
const NOTICE_STYLES = {
  info: {
    background: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
    color: '#1d4ed8',
    icon: (
      <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    )
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    color: '#b45309',
    icon: (
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    )
  },
  success: {
    background: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
    color: '#15803d',
    icon: (
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    )
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    color: '#b91c1c',
    icon: (
      <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    )
  }
};

function Notice() {
  const { Notice } = window.Config;
  const locale = getLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringHide, setIsHoveringHide] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    if (!Notice?.enable) return;
    if (Notice.priority) {
      setIsVisible(true);
      return;
    }
    const hideUntil = localStorage.getItem('notice_hide_until');
    const shouldShow = !hideUntil || new Date(hideUntil) < new Date();
    setIsVisible(shouldShow);
  }, []);
  
  if (!Notice?.enable || !isVisible) return null;
  
  const noticeType = Notice.type || 'info';
  const style = NOTICE_STYLES[noticeType];
  
  const handleClose = () => {
    if (Notice.priority) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };
  
  const handleHideToday = () => {
    if (Notice.priority) return;
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);
    localStorage.setItem('notice_hide_until', tomorrow.toISOString());
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };
  
  return (
    <div className={`notice-wrapper ${isClosing ? 'notice-closing' : ''}`}>
      <div className={`notice notice-${noticeType} ${Notice.priority ? 'notice-priority' : ''}`} style={style}>
        <div className="notice-content">
          <svg className="notice-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {style.icon}
          </svg>
          <span className="notice-text">{Notice.text[locale] || Notice.text['en-US']}</span>
          {!Notice.priority && (
            <div className="notice-actions">
              <button 
                className="notice-action" 
                onClick={handleHideToday}
                onMouseEnter={() => setIsHoveringHide(true)}
                onMouseLeave={() => setIsHoveringHide(false)}
                title={getText('notice.hideToday')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {isHoveringHide && (
                  <span className="notice-tooltip">{getText('notice.hideToday')}</span>
                )}
              </button>
              <button 
                className="notice-action" 
                onClick={handleClose}
                title={getText('notice.close')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notice;
