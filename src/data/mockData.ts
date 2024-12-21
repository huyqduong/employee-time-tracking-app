// Mock data for Zip Mechanical employee time tracking app

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  department: string;
  position: string;
  joinDate: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  assignedTo: string;
  projectId: string;
  timeSpent: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'In Progress' | 'Completed' | 'On Hold';
  client: string;
  startDate: string;
  endDate?: string;
  type: 'Commercial' | 'Residential' | 'Industrial';
  location: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  taskId?: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'admin@zipmechanical.com',
    role: 'admin',
    department: 'Management',
    position: 'Project Manager',
    joinDate: '2020-01-15',
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike.j@zipmechanical.com',
    role: 'employee',
    department: 'HVAC',
    position: 'Senior HVAC Technician',
    joinDate: '2021-03-20',
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    email: 'sarah.w@zipmechanical.com',
    role: 'employee',
    department: 'Plumbing',
    position: 'Plumbing Specialist',
    joinDate: '2021-06-15',
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.b@zipmechanical.com',
    role: 'employee',
    department: 'Electrical',
    position: 'Master Electrician',
    joinDate: '2022-02-10',
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Seattle Office Complex HVAC Installation',
    description: 'Complete HVAC system installation for new office complex',
    status: 'Active',
    client: 'Seattle Business Center',
    startDate: '2024-01-05',
    type: 'Commercial',
    location: 'Seattle, WA',
  },
  {
    id: '2',
    name: 'Residential Plumbing Renovation',
    description: 'Complete plumbing system upgrade for luxury home',
    status: 'In Progress',
    client: 'Private Residence',
    startDate: '2024-01-10',
    type: 'Residential',
    location: 'Bellevue, WA',
  },
  {
    id: '3',
    name: 'Industrial Facility Maintenance',
    description: 'Regular maintenance and system checks for manufacturing plant',
    status: 'In Progress',
    client: 'Northwest Manufacturing',
    startDate: '2024-01-02',
    type: 'Industrial',
    location: 'Tacoma, WA',
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'HVAC System Installation - Phase 1',
    description: 'Install main HVAC units on office building floors 1-5',
    status: 'In Progress',
    assignedTo: '2', // Mike Johnson
    projectId: '1',
    timeSpent: '32h',
    dueDate: '2024-01-25',
    priority: 'High',
  },
  {
    id: '2',
    title: 'Bathroom Plumbing Upgrade',
    description: 'Replace all bathroom fixtures and piping',
    status: 'Pending',
    assignedTo: '3', // Sarah Wilson
    projectId: '2',
    timeSpent: '0h',
    dueDate: '2024-01-30',
    priority: 'Medium',
  },
  {
    id: '3',
    title: 'Quarterly Equipment Maintenance',
    description: 'Perform regular maintenance checks on industrial equipment',
    status: 'In Progress',
    assignedTo: '4', // David Brown
    projectId: '3',
    timeSpent: '16h',
    dueDate: '2024-01-20',
    priority: 'Medium',
  },
];

// Mock Time Entries
export const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    employeeId: '2',
    projectId: '1',
    taskId: '1',
    startTime: '2024-01-20T08:00:00',
    endTime: '2024-01-20T16:00:00',
    duration: '8h',
    notes: 'Completed installation of main units on floor 1',
    status: 'Approved',
  },
  {
    id: '2',
    employeeId: '3',
    projectId: '2',
    taskId: '2',
    startTime: '2024-01-20T09:00:00',
    endTime: '2024-01-20T17:00:00',
    duration: '8h',
    notes: 'Started bathroom renovation project',
    status: 'Pending',
  },
  {
    id: '3',
    employeeId: '4',
    projectId: '3',
    taskId: '3',
    startTime: '2024-01-20T07:30:00',
    endTime: '2024-01-20T15:30:00',
    duration: '8h',
    notes: 'Performed maintenance checks on production line equipment',
    status: 'Approved',
  },
];

// Department Statistics
export const departmentStats = {
  HVAC: {
    totalHours: 450,
    completedTasks: 28,
    activeProjects: 5,
    efficiency: 92,
  },
  Plumbing: {
    totalHours: 380,
    completedTasks: 23,
    activeProjects: 4,
    efficiency: 88,
  },
  Electrical: {
    totalHours: 410,
    completedTasks: 25,
    activeProjects: 4,
    efficiency: 90,
  },
};

// Project Types Distribution
export const projectTypeDistribution = [
  { type: 'Commercial', value: 45 },
  { type: 'Residential', value: 35 },
  { type: 'Industrial', value: 20 },
];

// Weekly Hours by Department
export const weeklyHoursByDepartment = [
  { day: 'Mon', HVAC: 85, Plumbing: 75, Electrical: 80 },
  { day: 'Tue', HVAC: 90, Plumbing: 80, Electrical: 85 },
  { day: 'Wed', HVAC: 88, Plumbing: 78, Electrical: 82 },
  { day: 'Thu', HVAC: 92, Plumbing: 82, Electrical: 88 },
  { day: 'Fri', HVAC: 95, Plumbing: 85, Electrical: 90 },
];

// Service Categories
export const serviceCategories = [
  'HVAC Installation',
  'HVAC Repair',
  'HVAC Maintenance',
  'Plumbing Installation',
  'Plumbing Repair',
  'Emergency Plumbing',
  'Electrical Installation',
  'Electrical Repair',
  'Emergency Electrical',
  'Preventive Maintenance',
  'System Inspections',
  'Energy Efficiency Upgrades',
];
