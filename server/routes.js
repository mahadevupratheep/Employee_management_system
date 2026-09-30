import { Router } from 'express';
import { dbStore } from './db.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  const mode = dbStore.getConnectionMode();
  res.json({
    status: 'ok',
    database: mode.mode,
    connected: mode.connected,
    timestamp: new Date().toISOString()
  });
});

apiRouter.get('/stats', async (req, res) => {
  try {
    const stats = await dbStore.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch statistics' });
  }
});

apiRouter.get('/employees', async (req, res) => {
  try {
    const { search, department, status, sortBy, sortOrder } = req.query;
    const employees = await dbStore.getEmployees({
      search: typeof search === 'string' ? search : undefined,
      department: typeof department === 'string' ? department : undefined,
      status: typeof status === 'string' ? status : undefined,
      sortBy: typeof sortBy === 'string' ? sortBy : undefined,
      sortOrder: sortOrder === 'desc' ? 'desc' : 'asc'
    });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch employees' });
  }
});

apiRouter.get('/employees/:id', async (req, res) => {
  try {
    const employee = await dbStore.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch employee' });
  }
});

apiRouter.post('/employees', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      role,
      salary,
      status,
      hireDate,
      location,
      avatarUrl,
      skills,
      performanceRating,
      notes
    } = req.body;

    if (!firstName || !lastName || !email || !department || !role) {
      return res.status(400).json({ error: 'First name, last name, email, department, and role are required' });
    }

    const all = await dbStore.getEmployees({});
    const emailExists = all.some((e) => e.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return res.status(409).json({ error: 'An employee with this email already exists' });
    }

    const employeeId = req.body.employeeId || `EMP-${1000 + all.length + 1}`;

    const newEmployee = await dbStore.createEmployee({
      employeeId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '+1 (555) 000-0000',
      department,
      role: role.trim(),
      salary: Number(salary) || 60000,
      status: status || 'Active',
      hireDate: hireDate || new Date().toISOString().split('T')[0],
      location: location || 'Remote',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map((s) => s.trim()).filter(Boolean) : []),
      performanceRating: Number(performanceRating) || 3,
      notes: notes || ''
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create employee' });
  }
});

apiRouter.put('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.salary !== undefined) {
      updates.salary = Number(updates.salary);
    }
    if (updates.performanceRating !== undefined) {
      updates.performanceRating = Number(updates.performanceRating);
    }
    if (typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updated = await dbStore.updateEmployee(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update employee' });
  }
});

apiRouter.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbStore.deleteEmployee(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete employee' });
  }
});

apiRouter.post('/employees/batch-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'List of IDs is required' });
    }
    const count = await dbStore.deleteManyEmployees(ids);
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete employees' });
  }
});

apiRouter.get('/departments', async (req, res) => {
  try {
    const departments = await dbStore.getDepartments();
    const employees = await dbStore.getEmployees({});

    const withMetrics = departments.map((d) => {
      const deptEmployees = employees.filter((e) => e.department === d.name);
      const totalPayroll = deptEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
      return {
        ...d,
        employeeCount: deptEmployees.length,
        totalPayroll
      };
    });

    res.json(withMetrics);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch departments' });
  }
});

apiRouter.post('/departments', async (req, res) => {
  try {
    const { name, code, description, head, budget, color } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Department name and code are required' });
    }

    const newDept = await dbStore.createDepartment({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description || '',
      head: head || 'Unassigned',
      budget: Number(budget) || 100000,
      color: color || '#2563eb'
    });

    res.status(201).json(newDept);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create department' });
  }
});

apiRouter.put('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.budget !== undefined) {
      updates.budget = Number(updates.budget);
    }
    const updated = await dbStore.updateDepartment(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update department' });
  }
});

apiRouter.delete('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbStore.deleteDepartment(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete department' });
  }
});

apiRouter.get('/activity', async (req, res) => {
  try {
    const activities = await dbStore.getActivities(20);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch activity logs' });
  }
});

apiRouter.post('/seed', async (req, res) => {
  try {
    await dbStore.resetAndSeedData();
    res.json({ success: true, message: 'Database reset to default seed data' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to reset seed data' });
  }
});
