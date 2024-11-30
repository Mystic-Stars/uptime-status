import { useState, useEffect, useRef } from 'react';
import { getText } from '../common/i18n';

function PullToRefresh({ onRefresh, children }) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const thresholdDistance = 80; // 触发刷新的阈值

  useEffect(() => {
    let isTouch = false;

    const handleTouchStart = (e) => {
      // 只在页面顶部时启用下拉
      if (window.scrollY === 0) {
        isTouch = true;
        startYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!isTouch) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;

      // 只允许向下拉动
      if (distance > 0) {
        e.preventDefault();
        // 添加阻尼效果
        const dampedDistance = Math.min(distance * 0.5, thresholdDistance * 1.5);
        setPullDistance(dampedDistance);
        setIsPulling(dampedDistance > thresholdDistance);
      }
    };

    const handleTouchEnd = async () => {
      if (!isTouch) return;
      isTouch = false;

      if (pullDistance > thresholdDistance) {
        // 触发刷新
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        }
      }

      // 重置状态
      setPullDistance(0);
      setIsPulling(false);
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [pullDistance, onRefresh]);

  return (
    <div ref={containerRef} className="pull-to-refresh">
      <div 
        className="pull-indicator"
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          opacity: Math.min(pullDistance / thresholdDistance, 1)
        }}
      >
        {isPulling ? (
          <div className="pull-text">{getText('refresh.release')}</div>
        ) : (
          <div className="pull-text">{getText('refresh.pull')}</div>
        )}
      </div>
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
}

export default PullToRefresh; 