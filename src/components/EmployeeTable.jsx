import React from 'react';
import { Eye, Edit3, Trash2, Star, Mail, Phone } from 'lucide-react';

export function EmployeeTable({
  employees,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onDelete
}) {
  const allSelected = employees.length > 0 && selectedIds.length === employees.length;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'On Leave':
        return 'status-leave';
      case 'Probation':
        return 'status-probation';
      case 'Terminated':
        return 'status-terminated';
      default:
        return '';
    }
  };

  const getDeptBadgeStyle = (dept) => {
    switch (dept) {
      case 'Engineering':
        return { backgroundColor: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' };
      case 'Product Design':
        return { backgroundColor: '#faf5ff', color: '#7c3aed', borderColor: '#ddd6fe' };
      case 'Product Management':
        return { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' };
      case 'Marketing':
        return { backgroundColor: '#fffbeb', color: '#d97706', borderColor: '#fde68a' };
      case 'Human Resources':
        return { backgroundColor: '#fef2f2', color: '#e11d48', borderColor: '#fecdd3' };
      case 'Finance & Operations':
        return { backgroundColor: '#eef2ff', color: '#4f46e5', borderColor: '#c7d2fe' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' };
    }
  };

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '40px', textAlign: 'center' }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
            </th>
            <th>Employee</th>
            <th>Role & Department</th>
            <th>Status</th>
            <th>Salary</th>
            <th>Rating</th>
            <th>Contact</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const isSelected = selectedIds.includes(emp._id);
            return (
              <tr key={emp._id} className={isSelected ? 'selected' : ''}>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(emp._id)}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </td>
                <td>
                  <div className="emp-cell">
                    <img
                      src={emp.avatarUrl}
                      alt={emp.firstName}
                      className="emp-avatar"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=6366f1&color=fff`;
                      }}
                    />
                    <div>
                      <div className="emp-name">
                        <span>{emp.firstName} {emp.lastName}</span>
                        <span className="emp-id-tag">{emp.employeeId}</span>
                      </div>
                      <div className="emp-location">{emp.location}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="role-text">{emp.role}</div>
                  <div style={{ marginTop: '4px' }}>
                    <span className="dept-pill" style={getDeptBadgeStyle(emp.department)}>
                      {emp.department}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(emp.status)}`}>
                    <span className="status-dot"></span>
                    <span>{emp.status}</span>
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(emp.salary)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>per annum</div>
                </td>
                <td>
                  <div className="rating-display">
                    <Star size={14} className="rating-star" />
                    <span>{emp.performanceRating}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ 5</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.775rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={12} color="var(--text-muted)" />
                      <span>{emp.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                      <Phone size={12} />
                      <span>{emp.phone}</span>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => onView(emp)}
                      title="View Details"
                      className="btn-icon-subtle"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(emp)}
                      title="Edit Profile"
                      className="btn-icon-subtle"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(emp._id)}
                      title="Delete Employee"
                      className="btn-icon-subtle"
                      style={{ color: '#dc2626' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
