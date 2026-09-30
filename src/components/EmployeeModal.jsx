import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, User, Mail, Phone, Briefcase, DollarSign, Calendar, MapPin, Star, FileText } from 'lucide-react';

export function EmployeeModal({
  isOpen,
  onClose,
  onSave,
  employee,
  departments
}) {
  const isEditing = Boolean(employee);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    role: '',
    salary: 75000,
    status: 'Active',
    hireDate: new Date().toISOString().split('T')[0],
    location: 'Remote',
    avatarUrl: '',
    skills: '',
    performanceRating: 4,
    notes: ''
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || (departments[0]?.name || 'Engineering'),
        role: employee.role || '',
        salary: employee.salary || 75000,
        status: employee.status || 'Active',
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
        location: employee.location || 'Remote',
        avatarUrl: employee.avatarUrl || '',
        skills: Array.isArray(employee.skills) ? employee.skills.join(', ') : '',
        performanceRating: employee.performanceRating || 4,
        notes: employee.notes || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '+1 (555) 010-2030',
        department: departments[0]?.name || 'Engineering',
        role: '',
        salary: 85000,
        status: 'Active',
        hireDate: new Date().toISOString().split('T')[0],
        location: 'New York, NY',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        skills: 'JavaScript, React, Node.js',
        performanceRating: 4,
        notes: ''
      });
    }
    setError(null);
  }, [employee, departments, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please provide first and last name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!formData.role.trim()) {
      setError('Please provide a job title/role.');
      return;
    }

    setIsSubmitting(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await onSave({
        ...formData,
        skills: skillsArray,
        salary: Number(formData.salary),
        performanceRating: Number(formData.performanceRating)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRandomAvatar = () => {
    const avatarSeeds = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    ];
    const randomIndex = Math.floor(Math.random() * avatarSeeds.length);
    setFormData((prev) => ({ ...prev, avatarUrl: avatarSeeds[randomIndex] }));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <div className="modal-title">
              {isEditing ? `Edit: ${employee?.firstName} ${employee?.lastName}` : 'Add New Employee'}
            </div>
            <div className="modal-subtitle">
              {isEditing ? 'Update profile, role, department or compensation.' : 'Register a new team member in MongoDB.'}
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ margin: '16px 24px 0', padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecdd3', color: '#dc2626', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="avatar-preview-box">
              <img
                src={formData.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'}
                alt="Avatar"
                className="avatar-preview-img"
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff';
                }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label">Profile Photo URL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="form-control"
                    style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                  />
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px', whiteSpace: 'nowrap' }}
                  >
                    <Sparkles size={13} color="#4f46e5" />
                    <span>Preset</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Jane"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Smith"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane.smith@company.net"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-control"
                >
                  {departments.map((d) => (
                    <option key={d._id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Job Title / Role *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Software Engineer"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Annual Salary ($)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-control"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Hire Date</label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Office / Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="San Francisco, CA or Remote"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Performance Rating (1 - 5)</label>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formData.performanceRating} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData.performanceRating}
                onChange={(e) => setFormData({ ...formData, performanceRating: e.target.value })}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Skills (Comma-separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, JavaScript, Node.js, Express, MongoDB"
                className="form-control"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Notes & Biography</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Key achievements, feedback, certifications..."
                className="form-control"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Profile' : 'Save Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
