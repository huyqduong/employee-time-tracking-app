import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DocumentArrowDownIcon,
  FunnelIcon,
  TableCellsIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline';
import { format as dateFormat, startOfWeek, endOfWeek } from 'date-fns';

interface ReportFilters {
  reportType: 'activity' | 'timeSpent' | 'attendance' | 'location';
  dateRange: 'day' | 'week' | 'month';
  employees: string[];
  taskCategories: string[];
}

const Reports = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    reportType: 'activity',
    dateRange: 'week',
    employees: [],
    taskCategories: [],
  });

  // Sample data - replace with actual data from your backend
  const activityData = [
    { day: 'Mon', hours: 7.5, tasks: 4 },
    { day: 'Tue', hours: 8, tasks: 5 },
    { day: 'Wed', hours: 6.5, tasks: 3 },
    { day: 'Thu', hours: 8, tasks: 6 },
    { day: 'Fri', hours: 7, tasks: 4 },
  ];

  const timeSpentData = [
    { category: 'Development', hours: 20 },
    { category: 'Meetings', hours: 10 },
    { category: 'Planning', hours: 8 },
    { category: 'Testing', hours: 12 },
  ];

  const attendanceData = [
    { date: '12/16', present: 45, absent: 2, late: 3 },
    { date: '12/17', present: 47, absent: 1, late: 2 },
    { date: '12/18', present: 44, absent: 3, late: 3 },
    { date: '12/19', present: 46, absent: 2, late: 2 },
    { date: '12/20', present: 45, absent: 2, late: 3 },
  ];

  const employees = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' },
  ];

  const taskCategories = [
    'Development',
    'Design',
    'Testing',
    'Meetings',
    'Planning',
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  type JobType = 'Commercial' | 'Residential' | 'Industrial';

  interface MockProject {
    id: number;
    location: string;
    status: 'Active' | 'Completed';
    type: JobType;
  }

  const mockProjects: MockProject[] = [
    { id: 1, location: 'New York', status: 'Active', type: 'Commercial' },
    { id: 2, location: 'Los Angeles', status: 'Completed', type: 'Residential' },
    { id: 3, location: 'Chicago', status: 'Active', type: 'Industrial' },
    { id: 4, location: 'Houston', status: 'Completed', type: 'Commercial' },
    { id: 5, location: 'New York', status: 'Active', type: 'Residential' },
  ];

  const mockTimeEntries = [
    { projectId: 1, duration: '8' },
    { projectId: 2, duration: '10' },
    { projectId: 3, duration: '6' },
    { projectId: 4, duration: '12' },
    { projectId: 5, duration: '8' },
  ];

  interface JobTypeStats {
    hours: number;
    projects: number;
  }

  interface LocationStats {
    totalHours: number;
    activeProjects: number;
    completedProjects: number;
    jobTypes: Record<JobType, JobTypeStats>;
  }

  const locationData = mockProjects.reduce((acc, project) => {
    const locationHours = mockTimeEntries
      .filter((entry) => entry.projectId === project.id)
      .reduce((hours, entry) => hours + (entry.duration ? parseInt(entry.duration) : 0), 0);

    if (!acc[project.location]) {
      acc[project.location] = {
        totalHours: 0,
        activeProjects: 0,
        completedProjects: 0,
        jobTypes: {
          Commercial: { hours: 0, projects: 0 },
          Residential: { hours: 0, projects: 0 },
          Industrial: { hours: 0, projects: 0 },
        },
      };
    }

    acc[project.location].totalHours += locationHours;
    if (project.status === 'Active') {
      acc[project.location].activeProjects += 1;
    } else if (project.status === 'Completed') {
      acc[project.location].completedProjects += 1;
    }

    acc[project.location].jobTypes[project.type].hours += locationHours;
    acc[project.location].jobTypes[project.type].projects += 1;

    return acc;
  }, {} as Record<string, LocationStats>);

  const locationDataArray = Object.entries(locationData)
    .map(([location, data]) => ({
      location,
      ...data,
      commercialHours: data.jobTypes.Commercial.hours,
      commercialProjects: data.jobTypes.Commercial.projects,
      residentialHours: data.jobTypes.Residential.hours,
      residentialProjects: data.jobTypes.Residential.projects,
      industrialHours: data.jobTypes.Industrial.hours,
      industrialProjects: data.jobTypes.Industrial.projects,
    }))
    .sort((a, b) => b.totalHours - a.totalHours);

  const handleExport = (format: 'csv' | 'pdf') => {
    let exportData: Record<string, string | number>[] = [];
    let headers: string[] = [];

    switch (filters.reportType) {
      case 'location':
        exportData = locationDataArray.map((item) => ({
          Location: item.location,
          'Total Hours': item.totalHours,
          'Commercial Hours': item.commercialHours,
          'Commercial Projects': item.commercialProjects,
          'Residential Hours': item.residentialHours,
          'Residential Projects': item.residentialProjects,
          'Industrial Hours': item.industrialHours,
          'Industrial Projects': item.industrialProjects,
          'Active Projects': item.activeProjects,
        }));
        headers = [
          'Location',
          'Total Hours',
          'Commercial Hours',
          'Commercial Projects',
          'Residential Hours',
          'Residential Projects',
          'Industrial Hours',
          'Industrial Projects',
          'Active Projects',
        ];
        break;
      case 'activity':
        exportData = activityData.map((item) => ({
          Day: item.day,
          'Hours Worked': item.hours,
          'Tasks Completed': item.tasks,
        }));
        headers = ['Day', 'Hours Worked', 'Tasks Completed'];
        break;
      case 'timeSpent':
        exportData = timeSpentData.map((item) => ({
          Category: item.category,
          Hours: item.hours,
        }));
        headers = ['Category', 'Hours'];
        break;
      case 'attendance':
        exportData = attendanceData.map((item) => ({
          Date: item.date,
          Present: item.present,
          Absent: item.absent,
          Late: item.late,
        }));
        headers = ['Date', 'Present', 'Absent', 'Late'];
        break;
      default:
        return; // Exit if no valid report type
    }

    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...exportData.map((row) => headers.map((header) => row[header]).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filters.reportType}_report_${dateFormat(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
    } else {
      // TODO: Implement PDF export
      console.log('PDF export not implemented yet');
    }
  };

  const renderReport = () => {
    switch (filters.reportType) {
      case 'activity':
        return (
          <div className="space-y-8">
            {/* Employee Activity Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Daily Activity
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="hours"
                      fill="#0EA5E9"
                      name="Hours Worked"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="tasks"
                      fill="#6366F1"
                      name="Tasks Completed"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours Worked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks Completed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activityData.map((day, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.hours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.tasks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'timeSpent':
        return (
          <div className="space-y-8">
            {/* Time Distribution Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Time Distribution by Category
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeSpentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="hours"
                    >
                      {timeSpentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time Spent Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeSpentData.map((category, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.hours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {((category.hours / timeSpentData.reduce((acc, curr) => acc + curr.hours, 0)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-8">
            {/* Attendance Trend Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Attendance Trend
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="present"
                      stroke="#0EA5E9"
                      name="Present"
                    />
                    <Line
                      type="monotone"
                      dataKey="absent"
                      stroke="#EF4444"
                      name="Absent"
                    />
                    <Line
                      type="monotone"
                      dataKey="late"
                      stroke="#F59E0B"
                      name="Late"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Absent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Late
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((day, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.present}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.absent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.late}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-8">
            {/* Location Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Hours by Location and Job Type
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationDataArray}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="commercialHours" fill="#0EA5E9" name="Commercial Hours" stackId="hours" />
                    <Bar dataKey="residentialHours" fill="#6366F1" name="Residential Hours" stackId="hours" />
                    <Bar dataKey="industrialHours" fill="#10B981" name="Industrial Hours" stackId="hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Location Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commercial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Residential
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industrial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active Projects
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locationDataArray.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.totalHours}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.commercialHours}h ({item.commercialProjects} projects)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.residentialHours}h ({item.residentialProjects} projects)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.industrialHours}h ({item.industrialProjects} projects)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.activeProjects}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              value={filters.reportType}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  reportType: e.target.value as ReportFilters['reportType'],
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="activity">Employee Activity</option>
              <option value="timeSpent">Time Spent per Task</option>
              <option value="attendance">Attendance</option>
              <option value="location">Hours by Location</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dateRange: e.target.value as ReportFilters['dateRange'],
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employees
            </label>
            <select
              multiple
              value={filters.employees}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  employees: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Task Categories
            </label>
            <select
              multiple
              value={filters.taskCategories}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  taskCategories: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {taskCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {renderReport()}
    </div>
  );
};

export default Reports;
