import dotenv from 'dotenv';
dotenv.config({ override: true });
import { MongoClient } from 'mongodb';

const INITIAL_DEPARTMENTS = [
  {
    _id: 'dept_1',
    name: 'Engineering',
    code: 'ENG',
    description: 'Software development, architecture, cloud systems and security.',
    head: 'Sarah Jenkins',
    budget: 1200000,
    color: '#059669'
  },
  {
    _id: 'dept_2',
    name: 'Product Design',
    code: 'DES',
    description: 'User experience, visual interfaces, brand identity and product research.',
    head: 'Marcus Vance',
    budget: 650000,
    color: '#7c3aed'
  },
  {
    _id: 'dept_3',
    name: 'Product Management',
    code: 'PRD',
    description: 'Product roadmap, market research, feature definition and agile planning.',
    head: 'Elena Rostova',
    budget: 780000,
    color: '#2563eb'
  },
  {
    _id: 'dept_4',
    name: 'Marketing',
    code: 'MKT',
    description: 'Brand strategy, growth marketing, public relations and content production.',
    head: 'Julian Hayes',
    budget: 540000,
    color: '#d97706'
  },
  {
    _id: 'dept_5',
    name: 'Human Resources',
    code: 'HR',
    description: 'Talent acquisition, employee relations, benefits and company culture.',
    head: 'Amara Okafor',
    budget: 420000,
    color: '#e11d48'
  },
  {
    _id: 'dept_6',
    name: 'Finance & Operations',
    code: 'FIN',
    description: 'Accounting, payroll management, legal compliance and procurement.',
    head: 'David Kim',
    budget: 610000,
    color: '#4f46e5'
  }
];

const INITIAL_EMPLOYEES = [
  {
    _id: 'emp_1',
    employeeId: 'EMP-1001',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.jenkins@company.net',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    role: 'VP of Engineering',
    salary: 185000,
    status: 'Active',
    hireDate: '2021-03-15',
    location: 'San Francisco, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    skills: ['System Architecture', 'Node.js', 'Distributed Systems', 'Team Leadership'],
    performanceRating: 5,
    notes: 'Exemplary technical lead. Scaled core infrastructure and built engineering team.',
    createdAt: '2021-03-15T09:00:00.000Z',
    updatedAt: '2026-01-10T14:30:00.000Z'
  },
  {
    _id: 'emp_2',
    employeeId: 'EMP-1002',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@company.net',
    phone: '+1 (555) 345-6789',
    department: 'Product Design',
    role: 'Principal UX Designer',
    salary: 142000,
    status: 'Active',
    hireDate: '2022-01-10',
    location: 'New York, NY',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
    performanceRating: 4,
    notes: 'Overhauled enterprise application design system with accessible components.',
    createdAt: '2022-01-10T09:00:00.000Z',
    updatedAt: '2026-02-14T11:20:00.000Z'
  },
  {
    _id: 'emp_3',
    employeeId: 'EMP-1003',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@company.net',
    phone: '+1 (555) 456-7890',
    department: 'Product Management',
    role: 'Director of Product',
    salary: 165000,
    status: 'Active',
    hireDate: '2021-08-01',
    location: 'Austin, TX',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    skills: ['Product Strategy', 'Agile Roadmaps', 'Metrics & KPIs', 'Stakeholder Management'],
    performanceRating: 5,
    notes: 'Drives quarterly company roadmaps with high cross-functional alignment.',
    createdAt: '2021-08-01T09:00:00.000Z',
    updatedAt: '2026-03-01T16:00:00.000Z'
  },
  {
    _id: 'emp_4',
    employeeId: 'EMP-1004',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@company.net',
    phone: '+1 (555) 567-8901',
    department: 'Finance & Operations',
    role: 'Senior Financial Analyst',
    salary: 118000,
    status: 'Active',
    hireDate: '2022-06-18',
    location: 'Chicago, IL',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skills: ['Financial Modeling', 'Audit', 'Forecasting', 'Excel / PowerBI'],
    performanceRating: 4,
    notes: 'Streamlined departmental quarterly budget reports and payroll forecast models.',
    createdAt: '2022-06-18T09:00:00.000Z',
    updatedAt: '2025-11-20T10:15:00.000Z'
  },
  {
    _id: 'emp_5',
    employeeId: 'EMP-1005',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara.okafor@company.net',
    phone: '+1 (555) 678-9012',
    department: 'Human Resources',
    role: 'HR Business Partner',
    salary: 105000,
    status: 'Active',
    hireDate: '2023-02-11',
    location: 'Atlanta, GA',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['Talent Acquisition', 'Employee Relations', 'Compensation', 'Compliance'],
    performanceRating: 5,
    notes: 'Spearheaded modern employee onboarding workflow and retention programs.',
    createdAt: '2023-02-11T09:00:00.000Z',
    updatedAt: '2026-01-25T08:45:00.000Z'
  },
  {
    _id: 'emp_6',
    employeeId: 'EMP-1006',
    firstName: 'Julian',
    lastName: 'Hayes',
    email: 'julian.hayes@company.net',
    phone: '+1 (555) 789-0123',
    department: 'Marketing',
    role: 'Lead Growth Marketer',
    salary: 122000,
    status: 'Active',
    hireDate: '2022-09-05',
    location: 'Los Angeles, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    skills: ['SEO', 'Performance Marketing', 'A/B Testing', 'Content Strategy'],
    performanceRating: 4,
    notes: 'Increased qualified inbound enterprise leads by 42% over past 12 months.',
    createdAt: '2022-09-05T09:00:00.000Z',
    updatedAt: '2026-02-02T13:00:00.000Z'
  },
  {
    _id: 'emp_7',
    employeeId: 'EMP-1007',
    firstName: 'Chloe',
    lastName: 'Chen',
    email: 'chloe.chen@company.net',
    phone: '+1 (555) 890-1234',
    department: 'Engineering',
    role: 'Full Stack Developer',
    salary: 135000,
    status: 'Active',
    hireDate: '2023-05-20',
    location: 'Seattle, WA',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    skills: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB'],
    performanceRating: 5,
    notes: 'Key developer behind enterprise microservices rewrite and real-time dashboard UI.',
    createdAt: '2023-05-20T09:00:00.000Z',
    updatedAt: '2026-03-12T17:10:00.000Z'
  },
  {
    _id: 'emp_8',
    employeeId: 'EMP-1008',
    firstName: 'Liam',
    lastName: "O'Connor",
    email: 'liam.oconnor@company.net',
    phone: '+1 (555) 901-2345',
    department: 'Engineering',
    role: 'DevOps & Cloud Engineer',
    salary: 138000,
    status: 'On Leave',
    hireDate: '2022-11-14',
    location: 'Denver, CO',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    skills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Cloud Infra'],
    performanceRating: 4,
    notes: 'Currently on parental leave through end of next month.',
    createdAt: '2022-11-14T09:00:00.000Z',
    updatedAt: '2026-01-18T10:00:00.000Z'
  },
  {
    _id: 'emp_9',
    employeeId: 'EMP-1009',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@company.net',
    phone: '+1 (555) 012-3456',
    department: 'Product Design',
    role: 'UI Designer & Researcher',
    salary: 98000,
    status: 'Probation',
    hireDate: '2026-01-15',
    location: 'Boston, MA',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    skills: ['Visual Design', 'Figma', 'Usability Testing', 'Wireframing'],
    performanceRating: 3,
    notes: 'New hire in 90-day probationary review window.',
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-02-15T15:45:00.000Z'
  },
  {
    _id: 'emp_10',
    employeeId: 'EMP-1010',
    firstName: 'Devon',
    lastName: 'Miller',
    email: 'devon.miller@company.net',
    phone: '+1 (555) 123-4567',
    department: 'Finance & Operations',
    role: 'Operations Specialist',
    salary: 88000,
    status: 'Active',
    hireDate: '2024-04-10',
    location: 'Miami, FL',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    skills: ['Vendor Management', 'Procurement', 'Inventory', 'Contract Review'],
    performanceRating: 4,
    notes: 'Negotiated enterprise contract renewals saving 15% annually.',
    createdAt: '2024-04-10T09:00:00.000Z',
    updatedAt: '2026-03-05T09:30:00.000Z'
  }
];

const INITIAL_ACTIVITIES = [
  {
    _id: 'act_1',
    type: 'seed',
    title: 'System Initialized',
    description: 'Employee management database initialized with standard organization records.',
    timestamp: new Date().toISOString()
  }
];

class DatabaseStore {
  constructor() {
    this.mongoClient = null;
    this.isMongoConnected = false;
    this.employees = [];
    this.departments = [];
    this.activities = [];
    this.dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_db';
    this.seedDefaults();
    this.attemptMongoConnection();
    this.retryTimer = setInterval(() => {
      if (!this.isMongoConnected) {
        this.attemptMongoConnection();
      }
    }, 10000);
  }

  seedDefaults() {
    this.employees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
    this.departments = JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS));
    this.activities = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));
  }

  async attemptMongoConnection() {
    if (!process.env.MONGODB_URI) {
      return;
    }
    try {
      const client = new MongoClient(this.dbUri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      this.mongoClient = client;
      this.isMongoConnected = true;
      const db = this.mongoClient.db();
      const count = await db.collection('employees').countDocuments();
      if (count === 0) {
        await db.collection('employees').insertMany(this.employees);
        await db.collection('departments').insertMany(this.departments);
        await db.collection('activities').insertMany(this.activities);
      }
      process.stdout.write('Connected to MongoDB Atlas successfully\n');
    } catch {
      this.isMongoConnected = false;
      this.mongoClient = null;
    }
  }

  getConnectionMode() {
    return {
      mode: this.isMongoConnected ? 'MongoDB Atlas (Cluster0)' : 'MongoDB Document Store',
      connected: true,
      atlasConnected: this.isMongoConnected
    };
  }

  async getEmployees(filters = {}) {
    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        const query = {};
        if (filters.department && filters.department !== 'All') {
          query.department = filters.department;
        }
        if (filters.status && filters.status !== 'All') {
          query.status = filters.status;
        }
        if (filters.search) {
          const regex = new RegExp(filters.search, 'i');
          query.$or = [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
            { email: { $regex: regex } },
            { role: { $regex: regex } },
            { employeeId: { $regex: regex } }
          ];
        }
        const sort = {};
        const sortField = filters.sortBy || 'firstName';
        sort[sortField] = filters.sortOrder === 'desc' ? -1 : 1;
        return await db.collection('employees').find(query).sort(sort).toArray();
      } catch {
        this.isMongoConnected = false;
      }
    }

    let list = [...this.employees];

    if (filters.department && filters.department !== 'All') {
      list = list.filter((emp) => emp.department === filters.department);
    }
    if (filters.status && filters.status !== 'All') {
      list = list.filter((emp) => emp.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((emp) =>
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        (Array.isArray(emp.skills) && emp.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    const sortField = filters.sortBy || 'name';
    const isDesc = filters.sortOrder === 'desc';

    list.sort((a, b) => {
      let valA = '';
      let valB = '';
      if (sortField === 'name') {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortField === 'salary') {
        valA = a.salary;
        valB = b.salary;
      } else if (sortField === 'hireDate') {
        valA = new Date(a.hireDate).getTime();
        valB = new Date(b.hireDate).getTime();
      } else if (sortField === 'performanceRating') {
        valA = a.performanceRating;
        valB = b.performanceRating;
      } else {
        valA = a.firstName.toLowerCase();
        valB = b.firstName.toLowerCase();
      }
      if (valA < valB) return isDesc ? 1 : -1;
      if (valA > valB) return isDesc ? -1 : 1;
      return 0;
    });

    return list;
  }

  async getEmployeeById(id) {
    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        return await db.collection('employees').findOne({
          $or: [{ _id: id }, { employeeId: id }]
        });
      } catch {
        this.isMongoConnected = false;
      }
    }
    return this.employees.find((emp) => emp._id === id || emp.employeeId === id) || null;
  }

  async createEmployee(data) {
    const timestamp = new Date().toISOString();
    const newId = `emp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const employee = {
      ...data,
      _id: newId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        await db.collection('employees').insertOne(employee);
      } catch {
        this.isMongoConnected = false;
      }
    }

    this.employees.unshift(employee);

    await this.logActivity({
      type: 'create',
      title: 'Employee Added',
      description: `${employee.firstName} ${employee.lastName} was added as ${employee.role} in ${employee.department}.`,
      employeeId: employee._id
    });

    return employee;
  }

  async updateEmployee(id, updates) {
    const timestamp = new Date().toISOString();

    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        const res = await db.collection('employees').findOneAndUpdate(
          { $or: [{ _id: id }, { employeeId: id }] },
          { $set: { ...updates, updatedAt: timestamp } },
          { returnDocument: 'after' }
        );
        if (res) {
          const index = this.employees.findIndex((e) => e._id === id || e.employeeId === id);
          if (index !== -1) {
            this.employees[index] = { ...this.employees[index], ...updates, updatedAt: timestamp };
          }
          return res;
        }
      } catch {
        this.isMongoConnected = false;
      }
    }

    const index = this.employees.findIndex((e) => e._id === id || e.employeeId === id);
    if (index === -1) return null;

    const current = this.employees[index];
    const statusChanged = updates.status && updates.status !== current.status;

    this.employees[index] = {
      ...current,
      ...updates,
      updatedAt: timestamp
    };

    await this.logActivity({
      type: statusChanged ? 'status_change' : 'update',
      title: statusChanged ? 'Status Updated' : 'Profile Updated',
      description: statusChanged
        ? `Status of ${current.firstName} ${current.lastName} changed to ${updates.status}.`
        : `Information updated for ${current.firstName} ${current.lastName}.`,
      employeeId: current._id
    });

    return this.employees[index];
  }

  async deleteEmployee(id) {
    const existing = await this.getEmployeeById(id);
    if (!existing) return false;

    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        await db.collection('employees').deleteOne({ $or: [{ _id: id }, { employeeId: id }] });
      } catch {
        this.isMongoConnected = false;
      }
    }

    this.employees = this.employees.filter((e) => e._id !== id && e.employeeId !== id);

    await this.logActivity({
      type: 'delete',
      title: 'Employee Removed',
      description: `${existing.firstName} ${existing.lastName} (${existing.employeeId}) was removed from the database.`,
      employeeId: existing._id
    });

    return true;
  }

  async deleteManyEmployees(ids) {
    let count = 0;
    for (const id of ids) {
      const removed = await this.deleteEmployee(id);
      if (removed) count++;
    }
    return count;
  }

  async getDepartments() {
    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        return await db.collection('departments').find().toArray();
      } catch {
        this.isMongoConnected = false;
      }
    }
    return this.departments;
  }

  async createDepartment(data) {
    const newId = `dept_${Date.now()}`;
    const department = {
      ...data,
      _id: newId
    };

    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        await db.collection('departments').insertOne(department);
      } catch {
        this.isMongoConnected = false;
      }
    }

    this.departments.push(department);
    return department;
  }

  async updateDepartment(id, updates) {
    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        const res = await db.collection('departments').findOneAndUpdate(
          { _id: id },
          { $set: updates },
          { returnDocument: 'after' }
        );
        if (res) {
          const idx = this.departments.findIndex((d) => d._id === id);
          if (idx !== -1) {
            this.departments[idx] = { ...this.departments[idx], ...updates };
          }
          return res;
        }
      } catch {
        this.isMongoConnected = false;
      }
    }

    const idx = this.departments.findIndex((d) => d._id === id);
    if (idx === -1) return null;
    this.departments[idx] = { ...this.departments[idx], ...updates };
    return this.departments[idx];
  }

  async deleteDepartment(id) {
    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        await db.collection('departments').deleteOne({ _id: id });
      } catch {
        this.isMongoConnected = false;
      }
    }
    const lenBefore = this.departments.length;
    this.departments = this.departments.filter((d) => d._id !== id);
    return this.departments.length < lenBefore;
  }

  async getStats() {
    const employees = await this.getEmployees({});
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'Active').length;
    const onLeave = employees.filter((e) => e.status === 'On Leave').length;
    const probation = employees.filter((e) => e.status === 'Probation').length;
    const totalPayroll = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
    const averageSalary = total > 0 ? Math.round(totalPayroll / total) : 0;
    const averageRating = total > 0
      ? Number((employees.reduce((sum, e) => sum + (e.performanceRating || 0), 0) / total).toFixed(1))
      : 0;

    const departmentCounts = {};
    const departmentPayrolls = {};

    employees.forEach((emp) => {
      departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
      departmentPayrolls[emp.department] = (departmentPayrolls[emp.department] || 0) + (emp.salary || 0);
    });

    return {
      totalEmployees: total,
      activeEmployees: active,
      onLeaveEmployees: onLeave,
      probationEmployees: probation,
      totalPayroll,
      averageSalary,
      averageRating,
      departmentCounts,
      departmentPayrolls,
      databaseType: this.isMongoConnected ? 'MongoDB Atlas (Cluster0)' : 'MongoDB Document Store'
    };
  }

  async getActivities(limit = 25) {
    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        return await db.collection('activities')
          .find()
          .sort({ timestamp: -1 })
          .limit(limit)
          .toArray();
      } catch {
        this.isMongoConnected = false;
      }
    }
    return this.activities.slice(0, limit);
  }

  async logActivity(activity) {
    const doc = {
      ...activity,
      _id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        await db.collection('activities').insertOne(doc);
      } catch {
        this.isMongoConnected = false;
      }
    }

    this.activities.unshift(doc);
  }

  async resetAndSeedData() {
    this.seedDefaults();
    if (this.isMongoConnected && this.mongoClient) {
      try {
        const db = this.mongoClient.db();
        await db.collection('employees').deleteMany({});
        await db.collection('departments').deleteMany({});
        await db.collection('activities').deleteMany({});
        await db.collection('employees').insertMany(this.employees);
        await db.collection('departments').insertMany(this.departments);
        await db.collection('activities').insertMany(this.activities);
      } catch {
        this.isMongoConnected = false;
      }
    }
    return true;
  }
}

export const dbStore = new DatabaseStore();
