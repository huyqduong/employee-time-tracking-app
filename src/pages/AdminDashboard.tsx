import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import {
  mockEmployees,
  mockProjects,
  mockTasks,
  projectTypeDistribution,
  weeklyHoursByDepartment,
  departmentStats
} from '../data/mockData';

const AdminDashboard = () => {
  const stats = [
    {
      name: 'Total Employees',
      value: mockEmployees.length.toString(),
      icon: UsersIcon,
      change: '+1',
      changeType: 'increase',
    },
    {
      name: 'Active Projects',
      value: mockProjects.filter(p => p.status === 'Active').length.toString(),
      icon: ClipboardDocumentListIcon,
      change: '+2',
      changeType: 'increase',
    },
    {
      name: 'Total Hours This Week',
      value: Object.values(departmentStats).reduce((acc, curr) => acc + curr.totalHours, 0).toString(),
      icon: ClockIcon,
      change: '+12.3%',
      changeType: 'increase',
    },
    {
      name: 'Pending Tasks',
      value: mockTasks.filter(t => t.status === 'Pending').length.toString(),
      icon: BellIcon,
      change: '-1',
      changeType: 'decrease',
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Zip Mechanical Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of employee activity and project management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-primary-500 rounded-md p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Hours Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Department Hours This Week</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyHoursByDepartment}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="HVAC" fill="#0088FE" />
                <Bar dataKey="Plumbing" fill="#00C49F" />
                <Bar dataKey="Electrical" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Project Type Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockProjects.map((project) => (
            <div key={project.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <ClipboardDocumentListIcon className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {project.name}
                    </p>
                    <p className="text-sm text-gray-500">{project.client} - {project.location}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'Active' ? 'bg-green-100 text-green-800' :
                    project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;