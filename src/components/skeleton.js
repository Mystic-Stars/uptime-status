function Skeleton() {
  return (
    <div className="skeleton-wrapper">
      {[1, 2, 3].map((group) => (
        <div key={group} className="skeleton-group">
          <div className="skeleton-header">
            <div className="skeleton-title" />
            <div className="skeleton-stats" />
          </div>
          <div className="skeleton-content">
            {[1, 2].map((item) => (
              <div key={item} className="skeleton-site">
                <div className="skeleton-meta">
                  <div className="skeleton-name" />
                  <div className="skeleton-url" />
                  <div className="skeleton-status" />
                </div>
                <div className="skeleton-timeline">
                  {[...Array(30)].map((_, i) => (
                    <div 
                      key={i} 
                      className="skeleton-day" 
                      style={{ '--index': i }}
                    />
                  ))}
                </div>
                <div className="skeleton-summary">
                  <div className="skeleton-date" />
                  <div className="skeleton-stats-group">
                    <div className="skeleton-uptime" />
                    <div className="skeleton-range" />
                  </div>
                  <div className="skeleton-today" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton; 