import React from 'react';
import { Users, Layers, BarChart3, History, Plus, RefreshCw, Database } from 'lucide-react';

export function Navbar({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  onResetSeed,
  dbType,
  isResetting
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand-section">
          <div className="brand-icon">
            <Users size={22} />
          </div>
          <div>
            <div className="brand-title">WorkCore</div>
            <div className="brand-subtitle">Employee Management System</div>
          </div>

          <div className="db-badge">
            <Database size={13} color="#059669" />
            <span>{dbType}</span>
            <div className="db-indicator"></div>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            onClick={() => onSelectTab('directory')}
            className={`nav-tab-btn ${currentTab === 'directory' ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Directory</span>
          </button>

          <button
            onClick={() => onSelectTab('departments')}
            className={`nav-tab-btn ${currentTab === 'departments' ? 'active' : ''}`}
          >
            <Layers size={16} />
            <span>Departments</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`nav-tab-btn ${currentTab === 'analytics' ? 'active' : ''}`}
          >
            <BarChart3 size={16} />
            <span>Analytics & Payroll</span>
          </button>

          <button
            onClick={() => onSelectTab('activity')}
            className={`nav-tab-btn ${currentTab === 'activity' ? 'active' : ''}`}
          >
            <History size={16} />
            <span>Audit Log</span>
          </button>
        </nav>

        <div className="navbar-actions">
          <button
            onClick={onResetSeed}
            disabled={isResetting}
            title="Reset to default seed data"
            className="btn-icon"
          >
            <RefreshCw size={15} className={isResetting ? 'spin' : ''} />
          </button>

          <button onClick={onOpenAddModal} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
    </header>
  );
}
