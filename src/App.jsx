import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchEmployees,
  fetchDepartments,
  fetchDashboardStats,
  fetchActivityLogs,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  batchDeleteEmployees,
  createDepartment,
  resetDatabaseSeed,
  checkHealth
} from './api.js';

import { Navbar } from './components/Navbar.jsx';
import { StatsCards } from './components/StatsCards.jsx';
import { EmployeeTable } from './components/EmployeeTable.jsx';
import { EmployeeGrid } from './components/EmployeeGrid.jsx';
import { EmployeeModal } from './components/EmployeeModal.jsx';
import { EmployeeDetailModal } from './components/EmployeeDetailModal.jsx';
import { DepartmentView } from './components/DepartmentView.jsx';
import { AnalyticsView } from './components/AnalyticsView.jsx';
import { ActivityLogView } from './components/ActivityLogView.jsx';

import {
  Search,
  LayoutGrid,
  List,
  Download,
  Trash2,
  Users,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('directory');
  const [viewMode, setViewMode] = useState('table');
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [dbType, setDbType] = useState('MongoDB');

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEmployee, setModalEmployee] = useState(null);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [toast, setToast] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = useCallback(async () => {
    try {
      const [empList, deptList, statsData, actList, health] = await Promise.all([
        fetchEmployees({
          search,
          department: deptFilter,
          status: statusFilter,
          sortBy,
          sortOrder
        }),
        fetchDepartments(),
        fetchDashboardStats(),
        fetchActivityLogs(),
        checkHealth().catch(() => ({ database: 'MongoDB Document Store' }))
      ]);

      setEmployees(empList);
      setDepartments(deptList);
      setStats(statsData);
      setActivities(actList);
      if (health && health.database) {
        setDbType(health.database);
      }
    } catch (err) {
      showToast('Error syncing with database', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, deptFilter, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === employees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(employees.map((e) => e._id));
    }
  };

  const handleOpenAdd = () => {
    setModalEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp) => {
    setModalEmployee(emp);
    setIsModalOpen(true);
  };

  const handleView = (emp) => {
    setDetailEmployee(emp);
  };

  const handleSaveEmployee = async (formData) => {
    if (modalEmployee) {
      const updated = await updateEmployee(modalEmployee._id, formData);
      showToast(`Updated profile for ${updated.firstName} ${updated.lastName}`);
    } else {
      const created = await createEmployee(formData);
      showToast(`Created employee profile: ${created.firstName} ${created.lastName}`);
    }
    await loadData();
  };

  const handleDeleteEmployee = async (id) => {
    const emp = employees.find((e) => e._id === id);
    const confirmName = emp ? `${emp.firstName} ${emp.lastName}` : 'this employee';
    if (!window.confirm(`Are you sure you want to delete ${confirmName}?`)) {
      return;
    }

    try {
      await deleteEmployee(id);
      if (detailEmployee && detailEmployee._id === id) {
        setDetailEmployee(null);
      }
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      showToast('Employee removed successfully');
      await loadData();
    } catch {
      showToast('Failed to delete employee', 'error');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected employee records?`)) {
      return;
    }

    try {
      const count = await batchDeleteEmployees(selectedIds);
      setSelectedIds([]);
      showToast(`Deleted ${count} employee records`);
      await loadData();
    } catch {
      showToast('Failed to delete records', 'error');
    }
  };

  const handleAddDepartment = async (deptData) => {
    try {
      const created = await createDepartment(deptData);
      showToast(`Created department: ${created.name}`);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to create department', 'error');
      throw err;
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset database with initial sample employee and department records?')) {
      return;
    }
    setIsResetting(true);
    try {
      await resetDatabaseSeed();
      showToast('Database reset to default seed records');
      await loadData();
    } catch {
      showToast('Failed to reset database', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportCSV = () => {
    if (employees.length === 0) {
      showToast('No employees available to export', 'error');
      return;
    }

    const headers = [
      'Employee ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Department',
      'Role',
      'Salary (USD)',
      'Status',
      'Hire Date',
      'Location',
      'Performance Rating',
      'Skills'
    ];

    const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

    const rows = employees.map((e) => [
      escapeCsv(e.employeeId),
      escapeCsv(e.firstName),
      escapeCsv(e.lastName),
      escapeCsv(e.email),
      escapeCsv(e.phone),
      escapeCsv(e.department),
      escapeCsv(e.role),
      e.salary || 0,
      escapeCsv(e.status),
      escapeCsv(e.hireDate ? e.hireDate.split('T')[0] : ''),
      escapeCsv(e.location),
      e.performanceRating || '',
      escapeCsv(Array.isArray(e.skills) ? e.skills.join('; ') : '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${employees.length} employee records to CSV`);
  };

  const handleSelectDepartmentFilter = (deptName) => {
    setDeptFilter(deptName);
    setCurrentTab('directory');
  };

  return (
    <div className="app-wrapper">
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={handleOpenAdd}
        onResetSeed={handleResetSeed}
        dbType={dbType}
        isResetting={isResetting}
      />

      <main className="main-content">
        <StatsCards stats={stats} departmentsCount={departments.length} />

        {currentTab === 'directory' && (
          <div className="panel">
            <div className="controls-bar">
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, role, email, ID or skills..."
                  className="search-input"
                />
              </div>

              <div className="filters-group">
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="select-control"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select-control"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Terminated">Terminated</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select-control"
                >
                  <option value="name">Sort by Name</option>
                  <option value="salary">Sort by Salary</option>
                  <option value="hireDate">Sort by Hire Date</option>
                  <option value="performanceRating">Sort by Rating</option>
                </select>

                <button
                  onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="btn btn-secondary"
                  title="Toggle sort direction"
                  style={{ padding: '8px 12px' }}
                >
                  <ArrowUpDown size={15} />
                  <span>{sortOrder.toUpperCase()}</span>
                </button>

                <div className="view-toggle">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                    title="Table view"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    title="Grid view"
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="btn btn-secondary"
                  title="Download employee list as CSV file"
                  style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                >
                  <Download size={16} />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="batch-bar">
                <span>{selectedIds.length} employee(s) selected</span>
                <button onClick={handleBatchDelete} className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
                  <Trash2 size={14} />
                  <span>Delete Selected</span>
                </button>
              </div>
            )}

            {employees.length === 0 ? (
              <div className="empty-state">
                <Users className="empty-icon" />
                <div className="empty-title">No employees matched your criteria</div>
                <div className="empty-desc">
                  Try adjusting your search terms, changing the department filter, or click Add Employee to insert a new record.
                </div>
                <button
                  onClick={() => {
                    setSearch('');
                    setDeptFilter('All');
                    setStatusFilter('All');
                  }}
                  className="btn btn-secondary"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === 'table' ? (
              <EmployeeTable
                employees={employees}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                onView={handleView}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteEmployee}
              />
            ) : (
              <EmployeeGrid
                employees={employees}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onView={handleView}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteEmployee}
              />
            )}
          </div>
        )}

        {currentTab === 'departments' && (
          <DepartmentView
            departments={departments}
            onAddDepartment={handleAddDepartment}
            onSelectDepartmentFilter={handleSelectDepartmentFilter}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView stats={stats} departments={departments} employees={employees} />
        )}

        {currentTab === 'activity' && (
          <ActivityLogView activities={activities} />
        )}
      </main>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={modalEmployee}
        departments={departments}
      />

      <EmployeeDetailModal
        isOpen={Boolean(detailEmployee)}
        onClose={() => setDetailEmployee(null)}
        employee={detailEmployee}
        onEdit={(emp) => {
          setDetailEmployee(null);
          handleOpenEdit(emp);
        }}
        onDelete={(id) => {
          handleDeleteEmployee(id);
        }}
      />

      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
