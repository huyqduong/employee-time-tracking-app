import React, { useState } from 'react';
import { TimeEntryForm } from '../components/TimeEntryForm';
import { TimeEntryEditModal } from '../components/TimeEntryEditModal';
import { TimeEntry, ScheduledJobLocation } from '../types';
import { useScheduledJobLocations } from '../hooks/useScheduledJobLocations';
import {
  ClockIcon,
  ListBulletIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

const TimeManagement = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | undefined>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { getTodaySchedule, getUpcomingSchedule, updateScheduleStatus, loading } = useScheduledJobLocations();

  const handleClockIn = async (schedule: ScheduledJobLocation) => {
    try {
      const success = await updateScheduleStatus(schedule.id, 'in_progress');
      if (success) {
        const newEntry: TimeEntry = {
          id: Date.now().toString(),
          startTime: new Date().toISOString(),
          jobLocation: schedule.jobLocation.name,
          scheduledJobLocationId: schedule.id,
          description: schedule.notes || '',
          status: 'draft',
        };
        setTimeEntries(prev => [newEntry, ...prev]);
        alert('Successfully clocked in!');
      }
    } catch (error) {
      alert('Failed to clock in. Please try again.');
    }
  };

  const handleClockOut = async (entry: TimeEntry) => {
    try {
      if (entry.scheduledJobLocationId) {
        await updateScheduleStatus(entry.scheduledJobLocationId, 'completed');
      }
      
      const updatedEntry: TimeEntry = {
        ...entry,
        endTime: new Date().toISOString(),
        totalHours: entry.startTime
          ? (new Date().getTime() - new Date(entry.startTime).getTime()) / (1000 * 60 * 60)
          : undefined,
      };

      setTimeEntries(prev =>
        prev.map(e => (e.id === entry.id ? updatedEntry : e))
      );
      alert('Successfully clocked out!');
    } catch (error) {
      alert('Failed to clock out. Please try again.');
    }
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: {
    startTime: string;
    endTime: string;
    jobLocation: string;
    description: string;
  }) => {
    if (!editingEntry) return;

    const updatedEntry: TimeEntry = {
      ...editingEntry,
      ...data,
      totalHours: (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60 * 60),
    };

    setTimeEntries(prev =>
      prev.map(entry => (entry.id === editingEntry.id ? updatedEntry : entry))
    );

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Time entry updated successfully!');
    } catch (error) {
      alert('Error updating time entry. Please try again.');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!window.confirm('Are you sure you want to delete this time entry?')) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
      alert('Time entry deleted successfully!');
    } catch (error) {
      alert('Error deleting time entry. Please try again.');
    }
  };

  const handleSubmitTimesheet = async (entryId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTimeEntries(prev =>
        prev.map(entry =>
          entry.id === entryId ? { ...entry, status: 'pending' } : entry
        )
      );
      alert('Timesheet submitted for approval!');
    } catch (error) {
      alert('Error submitting timesheet. Please try again.');
    }
  };

  const getStatusBadgeClass = (status: TimeEntry['status'] | ScheduledJobLocation['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderScheduleTab = () => {
    const todaySchedule = getTodaySchedule();
    const upcomingSchedule = getUpcomingSchedule();

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
          {todaySchedule.length === 0 ? (
            <p className="text-gray-500">No scheduled locations for today</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todaySchedule.map(schedule => (
                <div
                  key={schedule.id}
                  className="bg-white rounded-lg shadow p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">{schedule.jobLocation.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                        schedule.status
                      )}`}
                    >
                      {schedule.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{schedule.jobLocation.address}</p>
                    <p>{`${schedule.jobLocation.city}, ${schedule.jobLocation.state} ${schedule.jobLocation.zip}`}</p>
                    <p className="font-medium">
                      {`${schedule.startTime} - ${schedule.endTime}`}
                    </p>
                  </div>
                  {schedule.notes && (
                    <p className="mt-2 text-sm text-gray-500">{schedule.notes}</p>
                  )}
                  {schedule.status === 'scheduled' && (
                    <button
                      onClick={() => handleClockIn(schedule)}
                      className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <ClockIcon className="h-5 w-5 mr-2" />
                      Clock In
                    </button>
                  )}
                  {schedule.status === 'in_progress' && (
                    <button
                      onClick={() => {
                        const entry = timeEntries.find(
                          e => e.scheduledJobLocationId === schedule.id
                        );
                        if (entry) {
                          handleClockOut(entry);
                        }
                      }}
                      className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <ClockIcon className="h-5 w-5 mr-2" />
                      Clock Out
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming Schedule</h2>
          {upcomingSchedule.length === 0 ? (
            <p className="text-gray-500">No upcoming scheduled locations</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingSchedule.map(schedule => (
                    <tr key={schedule.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(parseISO(schedule.startDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {schedule.jobLocation.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {`${schedule.startTime} - ${schedule.endTime}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            schedule.status
                          )}`}
                        >
                          {schedule.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeEntries.map(entry => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(entry.startTime), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.jobLocation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.totalHours?.toFixed(2) || 'In Progress'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      entry.status
                    )}`}
                  >
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {entry.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {entry.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleSubmitTimesheet(entry.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Submit for Approval"
                        >
                          <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {timeEntries.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-sm text-gray-500 text-center"
                >
                  No time entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Timesheet Management</h1>
        <p className="text-gray-600">
          View your schedule and manage your timesheets
        </p>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`${
              activeTab === 'schedule'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            } px-3 py-2 font-medium text-sm rounded-md flex items-center`}
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            } px-3 py-2 font-medium text-sm rounded-md flex items-center`}
          >
            <ListBulletIcon className="h-5 w-5 mr-2" />
            Timesheet History
          </button>
        </nav>
      </div>

      {activeTab === 'schedule' ? renderScheduleTab() : renderHistoryTab()}

      <TimeEntryEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEntry(undefined);
        }}
        onSubmit={handleEditSubmit}
        entry={editingEntry}
      />
    </div>
  );
};

export default TimeManagement;
