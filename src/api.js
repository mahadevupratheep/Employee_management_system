export async function fetchEmployees(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.department && filters.department !== 'All') params.append('department', filters.department);
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

  const res = await fetch(`/api/employees?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export async function fetchEmployeeById(id) {
  const res = await fetch(`/api/employees/${id}`);
  if (!res.ok) throw new Error('Failed to fetch employee details');
  return res.json();
}

export async function createEmployee(data) {
  const res = await fetch('/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create employee');
  }
  return res.json();
}

export async function updateEmployee(id, data) {
  const res = await fetch(`/api/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update employee');
  }
  return res.json();
}

export async function deleteEmployee(id) {
  const res = await fetch(`/api/employees/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete employee');
}

export async function batchDeleteEmployees(ids) {
  const res = await fetch('/api/employees/batch-delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  if (!res.ok) throw new Error('Failed to batch delete employees');
  const data = await res.json();
  return data.count;
}

export async function fetchDepartments() {
  const res = await fetch('/api/departments');
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
}

export async function createDepartment(data) {
  const res = await fetch('/api/departments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create department');
  }
  return res.json();
}

export async function fetchDashboardStats() {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to fetch statistics');
  return res.json();
}

export async function fetchActivityLogs() {
  const res = await fetch('/api/activity');
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

export async function resetDatabaseSeed() {
  const res = await fetch('/api/seed', {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset database');
}

export async function checkHealth() {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
