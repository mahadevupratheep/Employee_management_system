import React from 'react';
import { DollarSign, Users } from 'lucide-react';
import { SalaryChart } from './SalaryChart.jsx';

export function AnalyticsView({ stats, departments, employees = [] }) {
  const totalEmployees = stats?.totalEmployees || 0;
  const totalPayroll = stats?.totalPayroll || 0;
  const deptCounts = stats?.departmentCounts || {};
  const deptPayrolls = stats?.departmentPayrolls || {};

  const deptList = departments.map((d) => {
    const count = deptCounts[d.name] || 0;
    const payroll = deptPayrolls[d.name] || 0;
    const countPct = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
    const payrollPct = totalPayroll > 0 ? Math.round((payroll / totalPayroll) * 100) : 0;
    const avgDeptSalary = count > 0 ? Math.round(payroll / count) : 0;

    return {
      ...d,
      count,
      payroll,
      countPct,
      payrollPct,
      avgDeptSalary
    };
  });

  deptList.sort((a, b) => b.payroll - a.payroll);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Workforce Analytics & Salary Distribution
        </h2>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          Real-time metrics calculated from current employee records and salary distributions.
        </p>
      </div>

      <SalaryChart departments={departments} employees={employees} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eef2ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Department Headcounts
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Percentage of total staff
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {deptList.map((d) => (
              <div key={d._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{d.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{d.count} ({d.countPct}%)</span>
                </div>
                <div className="progress-track" style={{ margin: 0, height: '8px' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${d.countPct}%`, backgroundColor: d.color || '#4f46e5' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Payroll Allocation by Division
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Share of overall annual budget
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {deptList.map((d) => (
              <div key={d._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{d.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(d.payroll)} ({d.payrollPct}%)
                  </span>
                </div>
                <div className="progress-track" style={{ margin: 0, height: '8px' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${d.payrollPct}%`, backgroundColor: d.color || '#059669' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Departmental Compensation Analysis
        </h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Headcount</th>
                <th>Total Annual Payroll</th>
                <th>Average Salary</th>
                <th>Budget Limit</th>
                <th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {deptList.map((d) => {
                const util = Math.round((d.payroll / (d.budget || 1)) * 100);
                return (
                  <tr key={d._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: d.color || '#4f46e5' }} />
                        <span>{d.name}</span>
                      </div>
                    </td>
                    <td>{d.count} employees</td>
                    <td style={{ fontWeight: 700 }}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(d.payroll)}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(d.avgDeptSalary)}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(d.budget)}
                    </td>
                    <td>
                      <span className={`status-badge ${util > 90 ? 'status-terminated' : util > 70 ? 'status-leave' : 'status-active'}`}>
                        {util}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
