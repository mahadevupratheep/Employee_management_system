import React from 'react';
import { Eye, Edit3, Trash2, Star, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

export function EmployeeGrid({
  employees,
  selectedIds,
  onToggleSelect,
  onView,
  onEdit,
  onDelete
}) {
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
    <div className="cards-grid">
      {employees.map((emp) => {
        const isSelected = selectedIds.includes(emp._id);

        return (
          <div key={emp._id} className={`emp-card ${isSelected ? 'selected' : ''}`}>
            <div className="emp-card-body">
              <div className="emp-card-top">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(emp._id)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <span className={`status-badge ${getStatusClass(emp.status)}`}>
                  <span className="status-dot"></span>
                  <span>{emp.status}</span>
                </span>
              </div>

              <div className="emp-card-profile">
                <img
                  src={emp.avatarUrl}
                  alt={emp.firstName}
                  className="emp-card-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=6366f1&color=fff`;
                  }}
                />
                <div className="emp-card-name">
                  {emp.firstName} {emp.lastName}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {emp.employeeId}
                </div>
                <div className="emp-card-role" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <Briefcase size={13} color="var(--text-muted)" />
                  <span>{emp.role}</span>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <span className="dept-pill" style={getDeptBadgeStyle(emp.department)}>
                    {emp.department}
                  </span>
                </div>
              </div>

              <div className="emp-card-details">
                <div className="detail-line">
                  <Mail size={13} color="var(--text-muted)" />
                  <span>{emp.email}</span>
                </div>
                <div className="detail-line">
                  <Phone size={13} color="var(--text-muted)" />
                  <span>{emp.phone}</span>
                </div>
                <div className="detail-line">
                  <MapPin size={13} color="var(--text-muted)" />
                  <span>{emp.location}</span>
                </div>
              </div>

              {emp.skills && emp.skills.length > 0 && (
                <div className="skills-tags">
                  {emp.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                  {emp.skills.length > 3 && (
                    <span className="skill-tag" style={{ color: 'var(--text-muted)' }}>
                      +{emp.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="emp-card-footer">
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Annual Salary
                </div>
                <div className="salary-tag">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0
                  }).format(emp.salary)}
                </div>
              </div>

              <div className="card-actions">
                <button
                  onClick={() => onView(emp)}
                  title="View Profile"
                  className="btn-icon-subtle"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => onEdit(emp)}
                  title="Edit Profile"
                  className="btn-icon-subtle"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => onDelete(emp._id)}
                  title="Delete"
                  className="btn-icon-subtle"
                  style={{ color: '#dc2626' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
