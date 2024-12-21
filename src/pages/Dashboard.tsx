import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { mockTasks, mockTimeEntries } from '../data/mockData';
import { format } from 'date-fns';

const Dashboard = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());

  // Get current user's tasks
  const currentUserId = '2'; // This would come from auth context in a real app
  const userTasks = mockTasks.filter(task => task.assignedTo === currentUserId);
  const userTimeEntries = mockTimeEntries.filter(entry => entry.employeeId === currentUserId);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate weekly hours
  const weeklyHours = [
    { name: 'Mon', hours: 8 },
    { name: 'Tue', hours: 7.5 },
    { name: 'Wed', hours: 8 },
    { name: 'Thu', hours: 6.5 },
    { name: 'Fri', hours: 4 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClockInOut = () => {
    setIsClockedIn(!isClockedIn);
    // In a real app, this would create a new time entry
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Track your time and manage your tasks for Zip Mechanical projects
        </p>
      </div>

      {/* Clock In/Out Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Time Tracking</h2>
            <p className="text-sm text-gray-500">
              {isClockedIn ? 'Currently working' : 'Not clocked in'}
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(currentTime), 'EEEE, MMMM d, yyyy h:mm:ss a')}
            </p>
          </div>
          <button
            onClick={handleClockInOut}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isClockedIn
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-primary-600 hover:bg-primary-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            {isClockedIn ? (
              <>
                <StopIcon className="h-5 w-5 mr-2" />
                Clock Out
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5 mr-2" />
                Clock In
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tasks and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">My Tasks</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {userTasks.map((task) => (
              <li key={task.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{task.timeSpent}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Weekly Hours Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">My Weekly Hours</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Time Entries */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Time Entries</h3>
        </div>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {userTimeEntries.map((entry) => (
              <li key={entry.id} className="px-4 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(entry.startTime), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(entry.startTime), 'h:mm a')} -{' '}
                      {entry.endTime ? format(new Date(entry.endTime), 'h:mm a') : 'Ongoing'}
                    </p>
                    {entry.notes && (
                      <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : entry.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
