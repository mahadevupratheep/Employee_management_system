import React from 'react';
import { X, Edit3, Trash2, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, Star, FileText } from 'lucide-react';

export function EmployeeDetailModal({
  isOpen,
  onClose,
  employee,
  onEdit,
  onDelete
}) {
  if (!isOpen || !employee) return null;

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

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(employee.salary || 0);

  const monthlyEst = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.round((employee.salary || 0) / 12));

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="emp-id-tag">{employee.employeeId}</span>
            <span className={`status-badge ${getStatusClass(employee.status)}`}>
              <span className="status-dot"></span>
              <span>{employee.status}</span>
            </span>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={employee.avatarUrl}
              alt={employee.firstName}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--border)',
                boxShadow: 'var(--shadow-md)'
              }}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.firstName + ' ' + employee.lastName)}&background=6366f1&color=fff`;
              }}
            />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {employee.firstName} {employee.lastName}
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <Briefcase size={14} color="var(--text-muted)" />
                <span>{employee.role}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                {employee.department}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Annual Compensation
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {formattedSalary}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Monthly Estimate
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '2px' }}>
                {monthlyEst}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="form-label">Contact Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Mail size={15} color="var(--text-muted)" />
                <span>{employee.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Phone size={15} color="var(--text-muted)" />
                <span>{employee.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <MapPin size={15} color="var(--text-muted)" />
                <span>{employee.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Calendar size={15} color="var(--text-muted)" />
                <span>Joined {employee.hireDate ? employee.hireDate.split('T')[0] : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="form-label" style={{ marginBottom: '6px' }}>Performance Rating</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  style={{
                    color: star <= employee.performanceRating ? '#f59e0b' : '#cbd5e1',
                    fill: star <= employee.performanceRating ? '#f59e0b' : 'none'
                  }}
                />
              ))}
              <span style={{ fontSize: '0.9rem', fontWeight: 800, marginLeft: '6px', color: 'var(--text-primary)' }}>
                {employee.performanceRating} / 5.0
              </span>
            </div>
          </div>

          {employee.skills && employee.skills.length > 0 && (
            <div>
              <div className="form-label" style={{ marginBottom: '6px' }}>Skills & Competencies</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {employee.skills.map((s, i) => (
                  <span key={i} className="skill-tag" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {employee.notes && (
            <div>
              <div className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <FileText size={14} />
                <span>Performance & Internal Notes</span>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {employee.notes}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => onDelete(employee._id)}
            className="btn btn-danger"
          >
            <Trash2 size={15} />
            <span>Delete Record</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="btn btn-primary"
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
