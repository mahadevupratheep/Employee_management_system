import React from 'react';
import { History, UserPlus, UserMinus, RefreshCw, Edit, CheckCircle } from 'lucide-react';

export function ActivityLogView({ activities }) {
  const getIcon = (type) => {
    switch (type) {
      case 'create':
        return <UserPlus size={16} color="#059669" />;
      case 'delete':
        return <UserMinus size={16} color="#dc2626" />;
      case 'status_change':
        return <CheckCircle size={16} color="#d97706" />;
      case 'seed':
        return <RefreshCw size={16} color="#4f46e5" />;
      default:
        return <Edit size={16} color="#2563eb" />;
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            System Audit & Activity Logs
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Chronological audit log of personnel creations, updates, department assignments, and data operations.
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="empty-state">
          <History className="empty-icon" />
          <div className="empty-title">No Activities Recorded</div>
          <div className="empty-desc">System events and user updates will appear here automatically.</div>
        </div>
      ) : (
        <div className="audit-list">
          {activities.map((act) => (
            <div key={act._id} className="audit-item">
              <div className="audit-icon">
                {getIcon(act.type)}
              </div>
              <div className="audit-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="audit-title">{act.title}</div>
                  <div className="audit-time">
                    {new Date(act.timestamp).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                </div>
                <div className="audit-desc">{act.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
