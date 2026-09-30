import React from 'react';
import { Users, UserCheck, DollarSign, Award, Building2, TrendingUp } from 'lucide-react';

export function StatsCards({ stats, departmentsCount }) {
  const totalEmployees = stats?.totalEmployees ?? 0;
  const activeEmployees = stats?.activeEmployees ?? 0;
  const totalPayroll = stats?.totalPayroll ?? 0;
  const averageSalary = stats?.averageSalary ?? 0;
  const averageRating = stats?.averageRating ?? 0;

  const formattedPayroll = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalPayroll);

  const formattedAvgSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(averageSalary);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Staff</span>
          <div className="stat-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Users size={16} />
          </div>
        </div>
        <div className="stat-value">{totalEmployees}</div>
        <div className="stat-desc" style={{ color: '#059669', fontWeight: 600 }}>
          Active personnel database
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Active Duty</span>
          <div className="stat-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <UserCheck size={16} />
          </div>
        </div>
        <div className="stat-value">{activeEmployees}</div>
        <div className="stat-desc">
          {totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0}% on active roster
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Annual Payroll</span>
          <div className="stat-icon-wrap" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
            <DollarSign size={16} />
          </div>
        </div>
        <div className="stat-value" style={{ fontSize: '1.4rem' }}>{formattedPayroll}</div>
        <div className="stat-desc">Total compensation</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Avg Salary</span>
          <div className="stat-icon-wrap" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
            <TrendingUp size={16} />
          </div>
        </div>
        <div className="stat-value" style={{ fontSize: '1.4rem' }}>{formattedAvgSalary}</div>
        <div className="stat-desc">Per team member</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Avg Review</span>
          <div className="stat-icon-wrap" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <Award size={16} />
          </div>
        </div>
        <div className="stat-value">
          {averageRating} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 5.0</span>
        </div>
        <div className="stat-desc">Performance metric</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Departments</span>
          <div className="stat-icon-wrap" style={{ backgroundColor: '#fef2f2', color: '#e11d48' }}>
            <Building2 size={16} />
          </div>
        </div>
        <div className="stat-value">{departmentsCount}</div>
        <div className="stat-desc">Operational units</div>
      </div>
    </div>
  );
}
