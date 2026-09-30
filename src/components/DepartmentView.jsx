import React, { useState } from 'react';
import { Layers, Plus, Users, DollarSign, UserCheck, X } from 'lucide-react';

export function DepartmentView({
  departments,
  onAddDepartment,
  onSelectDepartmentFilter
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [head, setHead] = useState('');
  const [budget, setBudget] = useState(500000);
  const [color, setColor] = useState('#4f46e5');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Please provide department name and code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddDepartment({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        head: head.trim() || 'Unassigned',
        budget: Number(budget) || 100000,
        color
      });
      setName('');
      setCode('');
      setDescription('');
      setHead('');
      setBudget(500000);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Organizational Departments
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Overview of company business units, budgets, team heads, and active headcounts.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>New Department</span>
        </button>
      </div>

      <div className="dept-grid" style={{ padding: 0 }}>
        {departments.map((dept) => {
          const payroll = dept.totalPayroll || 0;
          const budget = dept.budget || 1;
          const budgetPct = Math.min(100, Math.round((payroll / budget) * 100));

          return (
            <div key={dept._id} className="dept-card">
              <div>
                <div className="dept-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: dept.color || '#4f46e5' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {dept.name}
                    </h3>
                  </div>
                  <span className="dept-code" style={{ backgroundColor: '#f1f5f9', color: 'var(--text-secondary)' }}>
                    {dept.code}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {dept.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '14px' }}>
                  <UserCheck size={16} color="var(--text-muted)" />
                  <span>Lead: {dept.head}</span>
                </div>

                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    <span>Budget Allocation</span>
                    <span>{budgetPct}% Used</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${budgetPct}%`,
                        backgroundColor: budgetPct > 90 ? '#dc2626' : (dept.color || '#4f46e5')
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <span>Payroll: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(payroll)}</span>
                    <span style={{ color: 'var(--text-muted)' }}>Budget: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(dept.budget)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  <Users size={15} color="var(--text-muted)" />
                  <span>{dept.employeeCount || 0} Staff Members</span>
                </div>

                <button
                  onClick={() => onSelectDepartmentFilter(dept.name)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                >
                  View Members
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div className="modal-title">Create New Department</div>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div style={{ margin: '16px 24px 0', padding: '10px', borderRadius: '6px', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '0.8rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Quality Assurance"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department Code (2-4 letters) *</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. QA"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department Head / Manager</label>
                  <input
                    type="text"
                    value={head}
                    onChange={(e) => setHead(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Annual Budget ($)</label>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Theme Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ height: '38px', width: '100%', padding: '2px', cursor: 'pointer', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Department mission, functions, and key objectives..."
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? 'Saving...' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
